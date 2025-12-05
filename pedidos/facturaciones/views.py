import json
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required

from facturaciones.logic.factura_logic import create_factura
from facturaciones.logic.pedido_logic import create_pedido
from facturaciones.models import Factura, Pedido
from productos.models import Producto
from provesiapp.auth0backend import getRole

# Create your views here.
def generar_factura(request):
    if request.method=="POST":
        try:
            data=json.loads(request.body)
            productos_cantidades=data.get("productos_cantidades", [])
            vip=data.get("vip", False)
            factura=create_factura(productos_cantidades, vip)
            return JsonResponse({
                "factura_id": factura.id,
                "total": factura.total,
                "pedido_id": factura.pedido.id if factura.pedido else None
            }, status=201)
        except Exception as e:
            return JsonResponse({
                "error": str(e)
            }, status=400)
    return JsonResponse({"error": "Método no permitido"}, status=405)

@login_required
def crear_pedido(request):
    role = getRole(request)
    if role != "Gerencia WMS":
        return HttpResponse("Unauthorized User", status=403)
    
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            productos_cantidades = data.get("productos_cantidades", [])
            vip = data.get("vip", False)
            
            if not productos_cantidades:
                return HttpResponse("Debes ingresar al menos un producto con cantidad", status=400)
            
            create_pedido(productos_cantidades, vip=vip)
            return HttpResponse("Pedido creado exitosamente")
        except Exception as e:
            return HttpResponse(f"Error creando pedido: {str(e)}", status=400)
    
    return HttpResponse("Método no permitido", status=405)

def facturas_pendientes(request):
    facturas = Factura.objects.all()
    context = list(facturas.values('id', 'total', 'pedido_id', 'fecha'))
    return JsonResponse(context, safe=False)

def crear_factura(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            pedido_id = data.get("pedido_id")

            if not pedido_id:
                return HttpResponse("Debes seleccionar un pedido válido", status=400)
            
            try:
                pedido = Pedido.objects.get(id=pedido_id)
                factura = create_factura(pedido)
                
                # Cambiar estado del pedido
                pedido.estado = "Empacado x despachar"
                pedido.save()

                return HttpResponse(f"Factura #{factura.id} creada para el pedido #{pedido.id}")
            except Pedido.DoesNotExist:
                return HttpResponse("El pedido seleccionado no existe", status=404)
        except Exception as e:
            return HttpResponse(f"Ocurrió un error al crear la factura: {str(e)}", status=400)
    
    return HttpResponse("Método no permitido", status=405)