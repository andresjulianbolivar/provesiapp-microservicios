import React, { useState } from 'react';
import { Cotizacion } from '../types/domain';
import { fetchCotizacionesByPedidoId } from '../api/cotizaciones';

const CotizacionesList: React.FC = () => {
  const [pedidoId, setPedidoId] = useState<string>('');
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCotizaciones(null);

    if (!pedidoId) return;

    try {
      setLoading(true);
      const data = await fetchCotizacionesByPedidoId(Number(pedidoId));
      if (data.length === 0) {
        setCotizaciones([]);
        setError('No se encontraron cotizaciones para el ID ingresado.');
      } else {
        setCotizaciones(data);
      }
    } catch (err) {
      setError('Error al buscar cotizaciones. Verifique la conexión con el servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPedidoId = (pedido: any): number => {
    return typeof pedido === 'object' ? pedido.id : pedido;
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div 
              className="card-header text-white py-3"
              style={{ backgroundColor: '#0E2EB0' }}
            >
              <h4 className="mb-0">
                <span className="me-2">📋</span>
                Cotizaciones
              </h4>
            </div>
            <div className="card-body p-4">
              <p className="text-muted mb-4">
                Consulta las cotizaciones de transporte asociadas a un pedido específico.
                Ingresa el ID del pedido para ver todas las opciones disponibles.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch}>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-end-0">
                    <span style={{ fontSize: '1.2rem' }}>🔍</span>
                  </span>
                  <input
                    type="number"
                    name="id"
                    className="form-control border-start-0 ps-0"
                    placeholder="Ingrese el ID del pedido"
                    value={pedidoId}
                    onChange={(e) => setPedidoId(e.target.value)}
                    min="1"
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4"
                    disabled={loading}
                    style={{ backgroundColor: '#0E2EB0', borderColor: '#0E2EB0' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Buscando...
                      </>
                    ) : (
                      'Buscar Cotizaciones'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Results Table */}
          {cotizaciones && cotizaciones.length > 0 && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light py-3">
                <h5 className="mb-0 text-secondary">
                  Resultados encontrados: 
                  <span className="badge bg-primary ms-2">{cotizaciones.length}</span>
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          ID Pedido
                        </th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Transportadora
                        </th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Precio
                        </th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Tiempo Estimado
                        </th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Peso
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizaciones.map((c) => (
                        <tr key={c.id} style={{ transition: 'background-color 0.2s' }}>
                          <td className="py-3 px-4">
                            <span className="badge bg-secondary">{getPedidoId(c.pedido)}</span>
                          </td>
                          <td className="py-3 px-4 fw-semibold">{c.transportadora}</td>
                          <td className="py-3 px-4">
                            <span className="text-success fw-bold">${c.precio.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="badge bg-info text-dark">{c.tiempo}</span>
                          </td>
                          <td className="py-3 px-4">{c.peso} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Error or No Results Messages */}
          {error && (
            <div className="alert alert-warning alert-dismissible fade show shadow-sm" role="alert">
              <div className="d-flex align-items-center">
                <span className="fs-4 me-3">⚠️</span>
                <div>
                  <strong>Atención:</strong> {error}
                </div>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          {cotizaciones && cotizaciones.length === 0 && !error && (
            <div className="alert alert-info shadow-sm" role="alert">
              <div className="d-flex align-items-center">
                <span className="fs-4 me-3">ℹ️</span>
                <div>
                  <strong>Sin resultados:</strong> No se encontraron cotizaciones para el pedido especificado.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CotizacionesList;
