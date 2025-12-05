# manejador_pedidos/pedidos/views/views.py
import json

from django.http import JsonResponse, HttpResponse
from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404

from ..logic.factura_logic import create_factura as logic_create_factura
from ..logic.pedido_logic import create_pedido as logic_create_pedido
from ..models import Factura, Pedido


@require_POST
def generar_factura(request):
    try:
        data = json.loads(request.body)
        pedido_id = data.get("pedido_id")

        if not pedido_id:
            return JsonResponse(
                {"error": "Falta 'pedido_id' en el cuerpo de la petición"},
                status=400,
            )

        pedido = get_object_or_404(Pedido, pk=pedido_id)

        factura = logic_create_factura(pedido)

        return JsonResponse(
            {
                "factura_id": factura.id,
                "total": str(factura.rubro_total),  # Decimal -> str
                "pedido_id": factura.pedido.id if factura.pedido else None,
            },
            status=201,
        )
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_POST
def crear_pedido(request):
    role = "Gerencia WMS"
    if role != "Gerencia WMS":
        return HttpResponse("Unauthorized User", status=403)

    try:
        data = json.loads(request.body)
        productos_cantidades = data.get("productos_cantidades", [])
        vip = data.get("vip", False)

        if not productos_cantidades:
            return HttpResponse(
                "Debes ingresar al menos un producto con cantidad", status=400
            )

        pedido = logic_create_pedido(productos_cantidades, vip=vip)

        return JsonResponse(
            {
                "pedido_id": pedido.id,
                "estado": pedido.estado,
                "vip": pedido.vip,
            }
        )
    except Exception as e:
        return HttpResponse(f"Error creando pedido: {str(e)}", status=400)


def facturas_pendientes(request):
    # OJO: tu modelo Factura tiene rubro_total, no 'total' ni 'fecha'
    facturas = Factura.objects.all()

    context = list(
        facturas.values(
            "id",
            "rubro_total",
            "pedido_id",
        )
    )
    return JsonResponse(context, safe=False)


@require_POST
def crear_factura(request):
    try:
        data = json.loads(request.body)
        pedido_id = data.get("pedido_id")

        if not pedido_id:
            return HttpResponse("Debes seleccionar un pedido válido", status=400)

        pedido = get_object_or_404(Pedido, pk=pedido_id)
        factura = logic_create_factura(pedido)

        # Cambiar estado del pedido
        pedido.estado = "Empacado x despachar"
        pedido.save()

        return HttpResponse(
            f"Factura #{factura.id} creada para el pedido #{pedido.id}"
        )
    except Exception as e:
        return HttpResponse(
            f"Ocurrió un error al crear la factura: {str(e)}", status=400
        )
