from __future__ import annotations

import enum
import os
import random
import string
from datetime import datetime

from flask_login import UserMixin
from sqlalchemy import func

from . import db
from config import Config


class Role(enum.Enum):
	ADMIN = "admin"
	MANAGER = "manager"
	USER = "user"


class User(db.Model, UserMixin):
	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.String(80), unique=True, nullable=False, index=True)
	email = db.Column(db.String(255), unique=True, nullable=True, index=True)
	password_hash = db.Column(db.String(255), nullable=False)
	role = db.Column(db.Enum(Role), default=Role.USER, nullable=False)
	created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
	qr_filename = db.Column(db.String(255), nullable=True)
	balance = db.Column(db.Integer, default=0, nullable=False)

	transactions = db.relationship(
		"WalletTransaction",
		foreign_keys="WalletTransaction.user_id",
		backref="target_user",
		lazy=True,
	)

	def get_id(self) -> str:
		return str(self.id)


class WalletTransaction(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, index=True)
	change_amount = db.Column(db.Integer, nullable=False)
	balance_after = db.Column(db.Integer, nullable=False)
	performed_by_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
	performed_by = db.relationship("User", foreign_keys=[performed_by_id])
	created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
	reason = db.Column(db.String(255), nullable=True)


class AuditLog(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	actor_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
	actor_username = db.Column(db.String(80), nullable=True)
	action = db.Column(db.String(80), nullable=False)
	resource = db.Column(db.String(120), nullable=False)
	meta = db.Column(db.Text, nullable=True)
	created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)


def generate_password_from_name(name: str) -> str:
	random_digits = "".join(random.choices(string.digits, k=4))
	base = name.strip().replace(" ", "").lower()
	return f"{base}{random_digits}"


def seed_admin() -> None:
	from werkzeug.security import generate_password_hash

	admin_username = Config.ADMIN_USERNAME
	admin_email = Config.ADMIN_EMAIL
	admin_password = Config.ADMIN_PASSWORD

	admin = User.query.filter(func.lower(User.username) == admin_username.lower()).first()
	if not admin:
		admin = User(
			username=admin_username,
			email=admin_email,
			password_hash=generate_password_hash(admin_password),
			role=Role.ADMIN,
			balance=0,
		)
		db.session.add(admin)
		db.session.commit()


