from flask import Blueprint, render_template, redirect, url_for, request, flash
from flask_login import login_required, current_user
from werkzeug.security import check_password_hash

from .models import User, Role
from .wallet import ensure_qr_for_user, change_balance
from . import db
from .audit import log_event
from .email_utils import send_credentials_email

main_bp = Blueprint("main", __name__)


@main_bp.get("/")
def index():
	if current_user.is_authenticated:
		return redirect(url_for("main.dashboard"))
	return render_template("index.html")


@main_bp.get("/mobile")
def mobile_access():
	"""Mobile access page with QR code and instructions"""
	return render_template("mobile_access.html")




@main_bp.get("/debug/users")
def debug_users():
	users = User.query.all()
	result = []
	for user in users:
		result.append({
			"id": user.id,
			"username": user.username,
			"role": user.role.value if user.role else None,
			"email": user.email,
			"balance": user.balance
		})
	return {"users": result, "count": len(result)}


@main_bp.get("/dashboard")
@login_required
def dashboard():
	print(f"DEBUG: Dashboard accessed by user: {current_user.username}, role: {current_user.role}")
	print(f"DEBUG: User authenticated: {current_user.is_authenticated}")
	if current_user.role == Role.ADMIN:
		return render_template("admin_dashboard.html")
	if current_user.role == Role.MANAGER:
		return render_template("manager_dashboard.html")
	# USER
	qr = ensure_qr_for_user(current_user)
	return render_template("user_dashboard.html", qr_filename=qr, balance=current_user.balance)


@main_bp.post("/admin/update-balance")
@login_required
def admin_update_balance():
	if current_user.role != Role.ADMIN:
		flash("Unauthorized", "danger")
		return redirect(url_for("main.dashboard"))
	username = request.form.get("username", "").strip()
	delta = int(request.form.get("delta", "0"))
	target = User.query.filter_by(username=username).first()
	if not target:
		flash("User not found", "danger")
		return redirect(url_for("main.dashboard"))
	
	transaction, success, message = change_balance(target, delta, reason="admin_update")
	if success:
		flash(message, "success")
	else:
		flash(message, "warning")
	return redirect(url_for("main.dashboard"))


@main_bp.post("/manager/update-balance")
@login_required
def manager_update_balance():
	if current_user.role not in [Role.ADMIN, Role.MANAGER]:
		flash("Unauthorized", "danger")
		return redirect(url_for("main.dashboard"))
	username = request.form.get("username", "").strip()
	action = request.form.get("action", "add")
	amount = int(request.form.get("amount", "0"))
	delta = amount if action == "add" else -amount
	target = User.query.filter_by(username=username).first()
	if not target:
		flash("User not found", "danger")
		return redirect(url_for("main.dashboard"))
	
	transaction, success, message = change_balance(target, delta, reason=f"manager_{action}")
	if success:
		flash(message, "success")
	else:
		flash(message, "warning")
	return redirect(url_for("main.dashboard"))


@main_bp.post("/admin/set-role")
@login_required
def admin_set_role():
	if current_user.role != Role.ADMIN:
		flash("Unauthorized", "danger")
		return redirect(url_for("main.dashboard"))
	username = request.form.get("username", "").strip()
	role_str = request.form.get("role", "user")
	target = User.query.filter_by(username=username).first()
	if not target:
		flash("User not found", "danger")
		return redirect(url_for("main.dashboard"))
	if role_str not in ("user", "manager"):
		flash("Invalid role", "danger")
		return redirect(url_for("main.dashboard"))
	target.role = Role.MANAGER if role_str == "manager" else Role.USER
	db.session.commit()
	flash("Role updated", "success")
	log_event("admin_set_role", resource=target.username, meta=f"role={role_str}")
	return redirect(url_for("main.dashboard"))


@main_bp.post("/admin/bulk-import")
@login_required
def admin_bulk_import():
	if current_user.role != Role.ADMIN:
		flash("Unauthorized", "danger")
		return redirect(url_for("main.dashboard"))
	from openpyxl import load_workbook
	from werkzeug.utils import secure_filename
	from werkzeug.security import generate_password_hash
	from .models import generate_password_from_name

	upload = request.files.get("file")
	if not upload:
		flash("No file uploaded", "danger")
		return redirect(url_for("main.dashboard"))

	wb = load_workbook(upload)
	ws = wb.active
	participants = []
	
	for row in ws.iter_rows(min_row=2, values_only=True):
		name, email = row[0], row[1]
		if not name:
			continue
		username = str(name).strip().replace(" ", "").lower()
		password_plain = generate_password_from_name(username)
		
		participants.append({
			'name': name,
			'email': email,
			'username': username,
			'password': password_plain,
			'exists': User.query.filter_by(username=username).first() is not None
		})

	return render_template("bulk_import_preview.html", participants=participants)


@main_bp.post("/admin/bulk-import-confirm")
@login_required
def admin_bulk_import_confirm():
	if current_user.role != Role.ADMIN:
		flash("Unauthorized", "danger")
		return redirect(url_for("main.dashboard"))
	from werkzeug.security import generate_password_hash
	from .models import generate_password_from_name

	# Get participants data from form
	participants_list = request.form.getlist("participants")
	if not participants_list:
		flash("No participants data found", "danger")
		return redirect(url_for("main.dashboard"))
	
	import json
	participants = []
	for participant_data in participants_list:
		try:
			# Clean the data if it has extra characters
			clean_data = participant_data.strip()
			if clean_data:
				participant = json.loads(clean_data)
				participants.append(participant)
		except json.JSONDecodeError as e:
			print(f"DEBUG: JSON decode error: {e}")
			print(f"DEBUG: Problematic data: {repr(participant_data)}")
			continue
	
	print(f"DEBUG: Total participants to process: {len(participants)}")
	created = 0
	emails_sent = 0
	
	for participant in participants:
		print(f"DEBUG: Processing participant: {participant}")
		if participant['exists']:
			continue
			
		# Create user
		print(f"DEBUG: Creating user with username: {participant['username']}, email: {participant['email']}")
		user = User(
			username=participant['username'],
			email=participant['email'],
			password_hash=generate_password_hash(participant['password']),
			role=Role.USER,
			balance=0.0
		)
		db.session.add(user)
		db.session.commit()
		ensure_qr_for_user(user)
		
		# Debug logging
		print(f"DEBUG: Created user - username: {participant['username']}, password: {participant['password']}")
		print(f"DEBUG: Password hash: {user.password_hash}")
		print(f"DEBUG: Password check: {check_password_hash(user.password_hash, participant['password'])}")
		
		# Send email asynchronously
		if participant['email']:
			try:
				# Try async email sending first
				from .celery_app import send_email_async
				task = send_email_async.delay(participant['email'], participant['username'], participant['password'])
				print(f"DEBUG: Email queued for {participant['email']} (task: {task.id})")
				emails_sent += 1
			except ImportError:
				# Fallback to synchronous email if Celery not available
				try:
					print(f"DEBUG: Attempting to send email to {participant['email']}")
					send_credentials_email(participant['email'], participant['username'], participant['password'])
					print(f"DEBUG: Email sent successfully to {participant['email']}")
					emails_sent += 1
				except Exception as e:
					print(f"DEBUG: Failed to send email to {participant['email']}: {e}")
					import traceback
					traceback.print_exc()
					flash(f"Failed to send email to {participant['email']}: {str(e)}", "warning")
			except Exception as e:
				print(f"DEBUG: Failed to queue email for {participant['email']}: {e}")
				flash(f"Failed to queue email for {participant['email']}: {str(e)}", "warning")
		
		created += 1

	flash(f"Created {created} users and sent {emails_sent} emails", "success")
	log_event("admin_bulk_import", resource="users", meta=f"created={created}, emails_sent={emails_sent}")
	return redirect(url_for("main.dashboard"))


