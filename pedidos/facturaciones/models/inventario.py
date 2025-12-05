from django.db import models
from inventarios.models.models import Bodega
import producto
class Inventario(models.Model):
    producto = models.ForeignKey(producto.Producto, on_delete=models.CASCADE)
    bodega = models.ForeignKey(Bodega, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    
    def __str__(self):
        return '{} {} {}'.format(self.producto,self.bodega,self.cantidad)