// Tipos basados en los modelos de Django

export interface Bodega {
  id: number;
  ciudad: string;
  direccion: string;
}

export interface Producto {
  codigo: number;
  nombre: string;
  color: string;
  talla: string;
  descripcion: string;
  precio: number;
  bodegas?: Bodega[];
}

export interface Inventario {
  id: number;
  producto: Producto | number;
  bodega: Bodega | number;
  cantidad: number;
}

export interface Pedido {
  id: number;
  fecha: string; // DateField -> string ISO
  vip: boolean;
  estado: string;
}

export interface Cantidad {
  id: number;
  pedido: Pedido | number;
  producto_id: number;
  nombre_producto: string;
  precio_unitario: number;
  unidades: number;
  subtotal?: number;
}

export interface Factura {
  id: number;
  rubro_total: number;
  orden_produccion: boolean;
  pedido: Pedido | number | null;
}

export interface Cotizacion {
  id: number;
  pedido: Pedido | number;
  transportadora: string;
  precio: number;
  tiempo: string;
  peso: number;
}
