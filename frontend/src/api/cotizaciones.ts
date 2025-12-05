import { api } from './client';
import { Cotizacion } from '../types/domain';

// GET /api/cotizaciones/?pedido_id=123
export async function fetchCotizacionesByPedidoId(pedidoId: number): Promise<Cotizacion[]> {
  const response = await api.get<Cotizacion[]>('/cotizaciones/', {
    params: { pedido_id: pedidoId },
  });
  return response.data;
}

// POST /api/cotizaciones/  { pedido_id: 123 }
export async function crearCotizacion(pedidoId: number): Promise<{ mensaje: string }> {
  const response = await api.post<{ mensaje: string }>('/cotizaciones/', {
    pedido_id: pedidoId,
  });
  return response.data;
}
