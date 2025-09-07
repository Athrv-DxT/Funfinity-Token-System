from celery import Celery
from flask import current_app
import os

def make_celery(app=None):
    celery = Celery(
        app.import_name if app else 'app',
        broker=os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
        backend=os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    )
    
    if app:
        celery.conf.update(app.config)
        
        class ContextTask(celery.Task):
            def __call__(self, *args, **kwargs):
                with app.app_context():
                    return self.run(*args, **kwargs)
        
        celery.Task = ContextTask
    
    return celery

# Create celery instance
celery = make_celery()

@celery.task
def send_email_async(to_email, username, password):
    """Send email asynchronously"""
    try:
        from .email_utils import send_credentials_email
        send_credentials_email(to_email, username, password)
        return f"Email sent successfully to {to_email}"
    except Exception as e:
        return f"Failed to send email to {to_email}: {str(e)}"
