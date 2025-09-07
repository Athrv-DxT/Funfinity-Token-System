import logging
import os
from logging.handlers import RotatingFileHandler

from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_migrate import Migrate

from config import get_config

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
login_manager.login_view = "auth.login_page"
login_manager.session_protection = "basic"  # Changed from "strong" for mobile compatibility


def create_app() -> Flask:
	app = Flask(__name__)
	# Load environment variables from .env if present
	load_dotenv()
	app.config.from_object(get_config())
	
	# Mobile-friendly session settings
	app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
	app.config['SESSION_COOKIE_SECURE'] = False  # Set to True only with HTTPS
	app.config['REMEMBER_COOKIE_SAMESITE'] = 'Lax'
	app.config['REMEMBER_COOKIE_SECURE'] = False

	# Extensions
	db.init_app(app)
	migrate.init_app(app, db)
	login_manager.init_app(app)

	# Blueprints
	from .auth import auth_bp
	from .routes import main_bp
	app.register_blueprint(auth_bp)
	app.register_blueprint(main_bp)

	# Logging
	setup_logging(app)

	# Seed admin
	with app.app_context():
		from .models import seed_admin
		# Ensure tables exist before seeding
		db.create_all()
		seed_admin()

	return app


def setup_logging(app: Flask) -> None:
	log_dir = os.path.join(app.instance_path, "logs")
	os.makedirs(log_dir, exist_ok=True)
	log_file = os.path.join(log_dir, "app.log")
	handler = RotatingFileHandler(log_file, maxBytes=2_000_000, backupCount=5)
	handler.setLevel(logging.INFO)
	formatter = logging.Formatter(
		"%(asctime)s %(levelname)s %(name)s %(request_id)s %(message)s"
	)
	handler.setFormatter(formatter)
	app.logger.addHandler(handler)
	app.logger.setLevel(logging.INFO)


@login_manager.user_loader
def load_user(user_id: str):
	from .models import User
	return User.query.get(int(user_id))


