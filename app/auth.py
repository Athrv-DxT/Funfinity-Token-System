from flask import Blueprint, render_template, request, redirect, url_for, flash
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

from . import db
from .models import User, Role
from .audit import log_event

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.get("/login")
def login_page():
	if current_user.is_authenticated:
		return redirect(url_for("main.dashboard"))
	return render_template("login.html")


@auth_bp.post("/login")
def login_submit():
	username = request.form.get("username", "").strip()
	password = request.form.get("password", "")
	print(f"DEBUG: Login attempt - username: '{username}', password length: {len(password)}")
	user = User.query.filter_by(username=username).first()
	print(f"DEBUG: User found: {user is not None}")
	if not user or not check_password_hash(user.password_hash, password):
		print(f"DEBUG: Login failed - user exists: {user is not None}")
		if user:
			print(f"DEBUG: Password check result: {check_password_hash(user.password_hash, password)}")
		flash("Invalid credentials", "danger")
		log_event("auth_login_failed", resource=username)
		return redirect(url_for("auth.login_page"))
	login_user(user, remember=True)
	print(f"DEBUG: Login successful for user: {user.username}")
	print(f"DEBUG: User authenticated: {user.is_authenticated}")
	log_event("auth_login", resource=user.username)
	return redirect(url_for("main.dashboard"))


@auth_bp.get("/register")
def register_page():
	if current_user.is_authenticated:
		return redirect(url_for("main.dashboard"))
	return render_template("register.html")


@auth_bp.post("/register")
def register_submit():
	username = request.form.get("username", "").strip()
	password = request.form.get("password", "")
	if not username or not password:
		flash("Username and password required", "danger")
		return redirect(url_for("auth.register_page"))
	if User.query.filter_by(username=username).first():
		flash("Username already exists", "danger")
		return redirect(url_for("auth.register_page"))
	user = User(username=username, password_hash=generate_password_hash(password), role=Role.USER)
	db.session.add(user)
	db.session.commit()
	log_event("auth_register", resource=user.username)
	login_user(user)
	return redirect(url_for("main.dashboard"))


@auth_bp.post("/logout")
@login_required
def logout_submit():
	log_event("auth_logout", resource=current_user.username)
	logout_user()
	return redirect(url_for("main.index"))


