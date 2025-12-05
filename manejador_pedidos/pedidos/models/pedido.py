from django.db import models
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from .cantidad import Cantidad

class Pedido(models.Model):
    id = models.AutoField(primary_key=True)
    fecha = models.DateField()
    vip = models.BooleanField()
    estado = models.CharField(max_length=50, default="Verificado")
    
    if TYPE_CHECKING:
        # para que Pylance sepa que existe pedido.items
        items: models.Manager["Cantidad"]

    def __str__(self):
        return f"Pedido #{self.id} - {self.fecha} - VIP: {self.vip} - Estado: {self.estado}"

