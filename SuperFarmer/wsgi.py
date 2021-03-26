"""
WSGI config for SuperFarmer project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application
from socketio import WSGIApp
from .socket import io

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'SuperFarmer.settings')

django_application = get_wsgi_application()
application = WSGIApp(io, django_application)
