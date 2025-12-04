from pydantic import BaseModel, Field, ConfigDict
from typing import List
from models.db import PyObjectId


class Bodega(BaseModel):
    ciudad: str = Field(...)
    direccion: str = Field(...)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "ciudad": "Bogotá",
                "direccion": "Calle 123 #45-67"
            }
        }
    )

class Producto(BaseModel):
    codigo: int = Field(...)
    nombre: str = Field(...)
    color: str = Field(...)
    talla: str = Field(...)
    descripcion: str = Field(...)
    precio: float = Field(...)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "codigo": 50123,
                "nombre": "Camiseta Deportiva",
                "color": "Azul",
                "talla": "M",
                "descripcion": "Camiseta técnica de entrenamiento",
                "precio": 25500.0
            }
        }
    )

class ProductoOut(Producto):
    id: PyObjectId = Field(alias="_id", default=None, serialization_alias="id")
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "64b9f1f4f1d2b2a3c4e5f6a7",
                "codigo": 50123,
                "nombre": "Camiseta Deportiva",
                "color": "Azul",
                "talla": "M",
                "descripcion": "Camiseta técnica de entrenamiento",
                "precio": 25500.0
            }
        },
    )
    
class InventarioItem(BaseModel):
    ciudad: str =  Field(...)
    direccion: str = Field(...)
    cantidad : int = Field(...)
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "ciudad": "Bogotá",
                "direccion": "Calle 123 #45-67",
                "cantidad": 9
            }
        }
    )
    
class Inventario(BaseModel):
    codigo: int = Field(...)
    nombre: str = Field(...)
    
    Inventario: List[InventarioItem]

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "codigo": 50123,
                "nombre": "Camiseta Deportiva",
                "inventario": [
                    {
                        "ciudad": "Bogotá",
                        "direccion": "Calle 123 #45-67",
                        "cantidad": 9
                    }
                ]
            }
        }
    )
    
class InventarioOut(Inventario):
    id: PyObjectId = Field(alias="_id", default=None, serialization_alias="id")
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "64b9f1f4f1d2b2a3c4e5f6a7",
                "codigo": 50123,
                "nombre": "Camiseta Deportiva",
                "inventario": [
                    {
                        "ciudad": "Bogotá",
                        "direccion": "Calle 123 #45-67",
                        "cantidad": 9
                    }
                ]
            }
        },
    )
    
class InventarioCollection(BaseModel):
    # A collection of places
    productos: List[InventarioOut] = Field(...)