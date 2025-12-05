from django.db import models

class Pedido(models.Model):
    fecha = models.DateField()
    vip = models.BooleanField()
    estado = models.CharField(max_length=50, default="Verificado")
    def __str__(self):
        return f"Pedido #{self.id} - {self.fecha} - VIP: {self.vip} - Estado: {self.estado}"
