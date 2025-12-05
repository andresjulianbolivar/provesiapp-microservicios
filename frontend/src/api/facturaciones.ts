import { api } from './client';
import { Producto, Pedido, Factura } from '../types/domain';

// ================== PRODUCTOS ==================

/**
 * Obtiene la lista de productos disponibles desde el microservicio de inventarios
 * para usarlos en la creación de pedidos.
 * GET /inventarios/productos/
 */
export async function fetchProductosParaPedido(): Promise<Producto[]> {
  const response = await api.get<Producto[]>('/productos/');
  return response.data;
}

// ================== PEDIDOS ==================

export interface CrearPedidoPayload {
  productos_cantidades: {
    codigo: number;
    nombre: string;
    precio: number;
    unidades: number;
  }[];
  vip: boolean;
}

export interface CrearPedidoResponse {
  pedido_id: number;
  estado: string;
  vip: boolean;
}

/**
 * Crea un nuevo pedido con los productos y cantidades especificados.
 * POST /pedidos/crear-pedido/
 */
export async function crearPedido(payload: CrearPedidoPayload): Promise<CrearPedidoResponse> {
  const response = await api.post<CrearPedidoResponse>('/pedidos/crear-pedido/', payload);
  return response.data;
}

/**
 * Obtiene la lista de pedidos en estado "Verificado" para crear facturas.
 * GET /pedidos/verificados/
 */
export async function fetchPedidosVerificados(): Promise<Pedido[]> {
  const response = await api.get<Pedido[]>('/pedidos/?estado=Verificado');
  return response.data;
}

/**
 * Marca un pedido como despachado.
 * POST /ManejadorPedidos/marcar-despachado/
 */
export async function marcarPedidoDespachado(pedidoId: number): Promise<void> {
  await api.post('/ManejadorPedidos/marcar-despachado/', {
    pedido_id: pedidoId,
  });
}

// ================== FACTURAS ==================

export interface CrearFacturaPayload {
  pedido_id: number;
}

export interface CrearFacturaResponse {
  factura_id?: number;
  total?: string;
  pedido_id?: number;
  mensaje?: string;
}

/**
 * Crea una factura para un pedido verificado.
 * POST /pedidos/crear-factura/
 */
export async function crearFactura(pedidoId: number): Promise<{ mensaje: string }> {
  const response = await api.post<string>(
    '/pedidos/crear-factura/',
    { pedido_id: pedidoId },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  
  // El backend devuelve texto plano, ej: "Factura #X creada para el pedido #Y"
  return { mensaje: typeof response.data === 'string' ? response.data : 'Factura creada correctamente' };
}

export interface FacturaConPedido extends Factura {
  pedido_data?: Pedido | null;
}

/**
 * Obtiene la lista de facturas pendientes.
 * GET /pedidos/facturas-pendientes/
 */
export async function fetchFacturasPendientes(): Promise<FacturaConPedido[]> {
  const response = await api.get<any[]>('/pedidos/facturas-pendientes/');
  
  // El backend devuelve un array con: {id, rubro_total, pedido_id}
  // Necesitamos enriquecer con datos del pedido si es necesario
  return response.data.map((item: any) => ({
    id: item.id,
    rubro_total: item.rubro_total,
    orden_produccion: item.orden_produccion || false,
    pedido: item.pedido_id,
    pedido_data: item.pedido_data || null,
  }));
}
