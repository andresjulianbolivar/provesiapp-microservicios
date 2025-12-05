# manejador_pedidos/wsgi.py
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "manejador_pedidos.settings")

application = get_wsgi_application()
