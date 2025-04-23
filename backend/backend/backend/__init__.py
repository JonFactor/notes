from __future__ import absolute_import, unicode_literals
from .celery import app as CRM_CELERY_APP
from .celery import app as celery_app  

__all__ = ["CRM_CELERY_APP"]