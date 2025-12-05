from django.db import models
from .pedido import Pedido
class Cantidad(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name="cantidades")
    producto = models.ForeignKey('productos.Producto', on_delete=models.CASCADE, related_name="cantidades")
    unidades = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.unidades}x {self.producto}"
    
