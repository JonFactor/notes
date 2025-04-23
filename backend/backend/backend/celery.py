import os
from celery import Celery
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend', broker="redis://127.0.0.1:6379",backend="redis://127.0.0.1:6379")

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks(settings.INSTALLED_APPS)
BROKER_URL = "redis://127.0.0.1:6379"
broker_url = "redis://127.0.0.1:6379"
app.conf.broker_url = BROKER_URL
CELERY_BROKER_URL = BROKER_URL



@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

