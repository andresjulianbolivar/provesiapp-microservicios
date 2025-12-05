from django.db import models

class Pedido(models.Model):
    id = models.AutoField(primary_key=True)
    fecha = models.DateField()
    vip = models.BooleanField()
    estado = models.CharField(max_length=50, default="Verificado")

