import { api } from './client';
import { Inventario, Producto } from '../types/domain';

export interface ConsultarStockResponse {
  producto: Producto | null;
  stock: Inventario[];
}

// POST /api/consultar-stock/
export async function consultarStockPorCodigo(codigo: string): Promise<ConsultarStockResponse> {
  const response = await api.post<ConsultarStockResponse>('/consultar-stock/', { codigo });
  return response.data;
}

// GET /api/inventarios/
export async function fetchInventarios(): Promise<Inventario[]> {
  const response = await api.get<Inventario[]>('/inventarios/');
  return response.data;
}
