from __future__ import annotations

import io
import os

import qrcode
from flask import current_app
from flask_login import current_user

from . import db
from .models import User, WalletTransaction
from .audit import log_event


def ensure_qr_for_user(user: User) -> str:
	if user.qr_filename:
		return user.qr_filename
	qr_dir = os.path.join(current_app.root_path, "static", "qr_codes")
	os.makedirs(qr_dir, exist_ok=True)
	filename = f"{user.id}.png"
	path = os.path.join(qr_dir, filename)
	img = qrcode.make(str(user.username))
	img.save(path)
	user.qr_filename = filename
	db.session.commit()
	log_event("qr_generated", resource=user.username)
	return filename


def change_balance(target_user: User, delta: int, reason: str | None = None) -> tuple[WalletTransaction | None, bool, str]:
	"""
	Change user balance with validation.
	Returns: (transaction, success, message)
	"""
	old_balance = target_user.balance
	new_balance = old_balance + delta
	
	# Check for negative balance
	if new_balance < 0:
		return None, False, f"Insufficient funds. Current balance: {old_balance}, attempted deduction: {abs(delta)}"
	
	target_user.balance = new_balance
	tr = WalletTransaction(
		user_id=target_user.id,
		change_amount=delta,
		balance_after=new_balance,
		performed_by_id=current_user.id if current_user.is_authenticated else target_user.id,
		reason=reason,
	)
	db.session.add(tr)
	db.session.commit()
	log_event("wallet_change", resource=target_user.username, meta=f"delta={delta};after={new_balance}")
	return tr, True, f"Balance updated successfully. New balance: {new_balance}"


