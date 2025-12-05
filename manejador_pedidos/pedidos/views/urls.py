# facturaciones/views/urls.py
from django.urls import path
from .views import generar_factura  # desde views.py

urlpatterns = [
    path("generar-factura/", generar_factura, name="generar_factura"),
]
