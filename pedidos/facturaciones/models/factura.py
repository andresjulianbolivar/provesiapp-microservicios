from django.db import models

class Factura(models.Model):
    rubro_total = models.FloatField()
    orden_produccion = models.BooleanField()
    pedido=models.OneToOneField('Pedido', on_delete=models.CASCADE, null=True, blank=True, related_name="factura")

    def __str__(self):
        return f"Factura #{self.id} - Total: {self.rubro_total}"

