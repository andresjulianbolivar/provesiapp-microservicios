# manejador_pedidos/pedidos/views/urls.py
from django.urls import path
from .views import (
    generar_factura,
    crear_pedido,
    crear_factura,
    facturas_pendientes,
)

urlpatterns = [
    path("generar-factura/", generar_factura, name="generar_factura_api"),
    path("crear-pedido/", crear_pedido, name="crear_pedido_api"),
    path("crear-factura/", crear_factura, name="crear_factura_api"),
    path("facturas-pendientes/", facturas_pendientes, name="facturas_pendientes_api"),
]
