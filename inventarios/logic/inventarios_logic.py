from models.models import Producto, InventarioCollection
from models.db import inventarios_collection
from pymongo.errors import DuplicateKeyError
from fastapi import HTTPException


async def get_inventario(producto_code: int):
    
    if (producto := await inventarios_collection.find_one({"codigo": producto_code})) is not None:
        return producto

    raise HTTPException(
        status_code=404, detail=f"Product with code {producto_code} not found"
    )