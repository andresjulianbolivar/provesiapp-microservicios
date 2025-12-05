from datetime import date
from decimal import Decimal

from ..models import Pedido, Cantidad


def create_pedido(productos_cantidades, vip: bool, estado: str = "Verificado") -> Pedido:
    pedido = Pedido.objects.create(
        fecha=date.today(),
        vip=vip,
        estado=estado,
    )

    for item in productos_cantidades:
        # {"codigo": ..., "nombre": ..., "precio": ..., "unidades": ...}
        Cantidad.objects.create(
            pedido=pedido,
            producto_id=item["codigo"],
            nombre_producto=item["nombre"],
            precio_unitario=Decimal(str(item["precio"])),
            unidades=item["unidades"],
        )

    return pedido
