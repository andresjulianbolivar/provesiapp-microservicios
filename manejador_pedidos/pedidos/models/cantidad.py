# cantidad.py
from django.db import models
from decimal import Decimal

from .pedido import Pedido

class Cantidad(models.Model):
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name="items"
    )

    # REFERENCIA LÓGICA AL PRODUCTO EN INVENTARIO
    producto_id = models.IntegerField()  # id del producto en MS Inventario

    # SNAPSHOT DE DATOS DEL PRODUCTO EN EL MOMENTO DEL PEDIDO
    nombre_producto = models.CharField(max_length=255)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)

    unidades = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.unidades}x {self.nombre_producto} (${self.precio_unitario})"

    @property
    def subtotal(self) -> Decimal:
        return self.precio_unitario * self.unidades
