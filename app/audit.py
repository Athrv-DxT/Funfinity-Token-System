from __future__ import annotations

import json
from flask_login import current_user

from . import db
from .models import AuditLog


def log_event(action: str, resource: str, meta: str | None = None) -> None:
	audit = AuditLog(
		action=action,
		resource=resource,
		actor_id=(current_user.id if current_user.is_authenticated else None),
		actor_username=(current_user.username if current_user.is_authenticated else None),
		meta=meta,
	)
	db.session.add(audit)
	db.session.commit()


