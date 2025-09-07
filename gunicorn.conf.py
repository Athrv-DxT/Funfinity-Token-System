import multiprocessing
import os

# Optimized for Railway free tier (250 concurrent users)
bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
workers = int(os.environ.get("GUNICORN_WORKERS", 2))
worker_class = "gevent"
worker_connections = 500
timeout = 60
graceful_timeout = 15
keepalive = 2
max_requests = 500
max_requests_jitter = 50

# Performance optimizations
preload_app = True
accesslog = "-"
errorlog = "-"
loglevel = "info"



