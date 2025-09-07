import multiprocessing
import os

# Optimized for 250 concurrent users on Railway
bind = f"0.0.0.0:{os.environ.get('PORT', 8000)}"
workers = int(os.environ.get("GUNICORN_WORKERS", 4))
worker_class = "gevent"
worker_connections = 1000
timeout = 120
graceful_timeout = 30
keepalive = 5
max_requests = 1000
max_requests_jitter = 100

# Performance optimizations
preload_app = True
accesslog = "-"
errorlog = "-"
loglevel = "info"



