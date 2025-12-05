from django.db import models
from .pedido import Pedido

class Factura(models.Model):
    id = models.AutoField(primary_key=True)
    rubro_total = models.FloatField()  # idealmente DecimalField
    orden_produccion = models.BooleanField()
    pedido = models.OneToOneField(Pedido, on_delete=models.PROTECT, null=True, blank=True, related_name="factura")

    def __str__(self):
        return f"Factura #{self.id} - Total: {self.rubro_total}"

