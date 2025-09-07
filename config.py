import os


class Config:
	SECRET_KEY = os.environ.get("SECRET_KEY", "change-this-in-prod")
	# PostgreSQL Database Configuration
	DATABASE_URL = os.environ.get("DATABASE_URL")
	if DATABASE_URL:
		SQLALCHEMY_DATABASE_URI = DATABASE_URL
	else:
		# Fallback to individual components
		DB_HOST = os.environ.get("DB_HOST", "localhost")
		DB_PORT = os.environ.get("DB_PORT", "5432")
		DB_NAME = os.environ.get("DB_NAME", "token_wallet")
		DB_USER = os.environ.get("DB_USER", "wallet_user")
		DB_PASSWORD = os.environ.get("DB_PASSWORD", "password")
		SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
	
	# Optimized for Railway free tier (250 concurrent users)
	SQLALCHEMY_ENGINE_OPTIONS = {
		"pool_pre_ping": True,
		"pool_recycle": 300,
		"pool_size": int(os.environ.get("DB_POOL_SIZE", 10)),
		"max_overflow": int(os.environ.get("DB_MAX_OVERFLOW", 10)),
		"pool_timeout": 30,
		"pool_reset_on_return": "commit",
		"connect_args": {
			"connect_timeout": 10,
			"application_name": "token_wallet"
		}
	}
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	REMEMBER_COOKIE_SECURE = True
	SESSION_COOKIE_SECURE = True
	PREFERRED_URL_SCHEME = "https"
	# Email
	SMTP_HOST = os.environ.get("SMTP_HOST") or os.environ.get("SMTP_SERVER", "smtp.gmail.com")
	SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
	SMTP_USER = os.environ.get("SMTP_USER") or os.environ.get("EMAIL_USER")
	SMTP_PASS = os.environ.get("SMTP_PASS") or os.environ.get("EMAIL_PASSWORD")
	FROM_EMAIL = os.environ.get("FROM_EMAIL") or os.environ.get("EMAIL_USER", "noreply@example.com")
	# Admin seed
	ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
	ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "Admin1234")
	ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "admin@example.com")
	
	# Caching configuration for performance
	CACHE_TYPE = 'simple'
	CACHE_DEFAULT_TIMEOUT = 300


class ProductionConfig(Config):
	DEBUG = False


class DevelopmentConfig(Config):
	DEBUG = True
	SQLALCHEMY_DATABASE_URI = os.environ.get("DEV_DATABASE_URL", "sqlite:///app_dev.db")


def get_config():
	env = os.environ.get("FLASK_ENV", "production").lower()
	return DevelopmentConfig if env == "development" else ProductionConfig


