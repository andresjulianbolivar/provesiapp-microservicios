import datetime
from decimal import Decimal
from ..models.factura import Factura
from ..models.pedido import Pedido
from . import pedido_logic as pedido_logic

def get_factura(id):
    queryset = Factura.objects.filter(id=id)
    return queryset

def get_facturas():
    queryset = Factura.objects.all()
    return queryset

def create_factura(pedido: Pedido) -> Factura:
    orden_produccion = False  # Heredado Legacy

    rubro_total = sum(
        (item.subtotal for item in pedido.items.all()),
        Decimal("0.00"),
    )

    factura = Factura.objects.create(
        rubro_total=rubro_total,
        orden_produccion=orden_produccion,
        pedido=pedido,
    )

    return factura
