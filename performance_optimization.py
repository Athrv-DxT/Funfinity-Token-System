#!/usr/bin/env python3
"""
Performance Optimization for Token Wallet System
Adds caching and connection optimizations
"""

# Add this to your app/__init__.py after the existing imports

CACHE_CONFIG = {
    'CACHE_TYPE': 'simple',  # Use simple in-memory cache for Railway
    'CACHE_DEFAULT_TIMEOUT': 300  # 5 minutes
}

# Add this to your config.py
class ProductionConfig(Config):
    DEBUG = False
    
    # Optimized database settings for Railway
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_size": 10,  # Reduced for Railway free tier
        "max_overflow": 10,  # Reduced for Railway free tier
        "pool_timeout": 30,
        "pool_reset_on_return": "commit",
        "connect_args": {
            "connect_timeout": 10,
            "application_name": "token_wallet"
        }
    }
    
    # Add caching
    CACHE_TYPE = 'simple'
    CACHE_DEFAULT_TIMEOUT = 300

# Add this to your app/__init__.py in create_app() function
def create_app() -> Flask:
    app = Flask(__name__)
    # ... existing code ...
    
    # Add caching
    from flask_caching import Cache
    cache = Cache()
    cache.init_app(app)
    
    # ... rest of existing code ...
    
    return app

# Add this to your app/routes.py for caching frequently accessed data
from flask_caching import Cache

@main_bp.get("/dashboard")
@login_required
def dashboard():
    # Cache user data for 5 minutes
    cache_key = f"user_data_{current_user.id}"
    user_data = cache.get(cache_key)
    
    if not user_data:
        # Fetch user data from database
        user_data = {
            'username': current_user.username,
            'balance': current_user.balance,
            'role': current_user.role.value
        }
        cache.set(cache_key, user_data, timeout=300)
    
    # ... rest of dashboard logic ...
