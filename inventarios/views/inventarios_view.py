from fastapi import APIRouter, status
import inventarios.logic.inventarios_logic as inventarios_service
from models.models import InventarioOut

router = APIRouter()
ENDPOINT_NAME = "/inventarios"


@router.get(
    "/{producto_code}",
    response_description="Retorna el inventario de un producto en todas las bodegas",
    response_model=InventarioOut,
    status_code=status.HTTP_200_OK,
)
async def get_place(place_code: int):
    return await inventarios_service.get_place(place_code)