import React, { useEffect, useState } from 'react';
import { fetchFacturasPendientes, FacturaConPedido, marcarPedidoDespachado } from '../api/facturaciones';
import DespacharPedidoModal from '../components/DespacharPedidoModal';

const FacturasPendientes: React.FC = () => {
  const [facturas, setFacturas] = useState<FacturaConPedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadFacturas = async () => {
      try {
        setLoading(true);
        const data = await fetchFacturasPendientes();
        setFacturas(data);
      } catch (err) {
        console.error('Error al cargar facturas pendientes:', err);
        setError('Error al cargar las facturas pendientes');
      } finally {
        setLoading(false);
      }
    };

    loadFacturas();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleDespacharClick = (pedidoId: number) => {
    setSelectedPedidoId(pedidoId);
    setShowModal(true);
    setSuccessMessage(null);
  };

  const handleConfirmDespacho = async () => {
    if (!selectedPedidoId) return;

    try {
      setIsSubmitting(true);
      await marcarPedidoDespachado(selectedPedidoId);
      
      // Success! Reload data
      setSuccessMessage(`¡Pedido #${selectedPedidoId} marcado como despachado exitosamente!`);
      setShowModal(false);
      
      // Reload facturas to reflect updated state
      const data = await fetchFacturasPendientes();
      setFacturas(data);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Error al despachar pedido:', err);
      setError('Error al marcar el pedido como despachado. Por favor intenta nuevamente.');
      setShowModal(false);
    } finally {
      setIsSubmitting(false);
      setSelectedPedidoId(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPedidoId(null);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold" style={{ color: '#0E2EB0' }}>
              <span className="me-2">📋</span>
              Facturas Pendientes
            </h2>
            <p className="text-muted">
              Listado de todas las facturas generadas en el sistema
            </p>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="alert alert-success border-0 shadow-sm mb-4 animate__animated animate__fadeInDown">
              <div className="d-flex align-items-center">
                <span className="me-3 fs-4">✅</span>
                <div>
                  <strong>{successMessage}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger border-0 shadow-sm mb-4">
              <div className="d-flex align-items-center">
                <span className="me-3 fs-4">⚠️</span>
                <div>
                  <strong>{error}</strong>
                </div>
                <button
                  type="button"
                  className="btn-close ms-auto"
                  onClick={() => setError(null)}
                  aria-label="Close"
                />
              </div>
            </div>
          )}

          {/* Stats Card */}
          {!loading && !error && facturas.length > 0 && (
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 bg-light">
                <div className="row text-center">
                  <div className="col-md-4">
                    <h3 className="mb-0" style={{ color: '#0E2EB0' }}>
                      {facturas.length}
                    </h3>
                    <p className="text-muted small mb-0">Total Facturas</p>
                  </div>
                  <div className="col-md-4">
                    <h3 className="mb-0 text-success">
                      {formatCurrency(
                        facturas.reduce((sum, f) => sum + f.rubro_total, 0)
                      )}
                    </h3>
                    <p className="text-muted small mb-0">Valor Total</p>
                  </div>
                  <div className="col-md-4">
                    <h3 className="mb-0 text-info">
                      {facturas.filter((f) => f.pedido !== null).length}
                    </h3>
                    <p className="text-muted small mb-0">Con Pedido Asociado</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger shadow-sm" role="alert">
              <div className="d-flex align-items-center">
                <span className="fs-4 me-3">❌</span>
                <div>
                  <strong>Error:</strong>
                  {' '}
                  {error}
                </div>
              </div>
            </div>
          )}

          {/* Table Card */}
          <div className="card border-0 shadow-sm">
            <div 
              className="card-header text-white py-3"
              style={{ backgroundColor: '#0E2EB0' }}
            >
              <h5 className="mb-0">Listado de Facturas</h5>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando facturas...</span>
                  </div>
                  <p className="text-muted mt-3">Cargando facturas pendientes...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover align-middle mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          ID
                        </th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Total
                        </th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Pedido
                        </th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Estado del Pedido
                        </th>
                        <th className="py-3 px-4 text-center" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {facturas.length > 0 ? (
                        facturas.map((factura) => (
                          <tr key={factura.id}>
                            <td className="py-3 px-4">
                              <span className="badge bg-primary fs-6">
                                {factura.id}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="fw-bold text-success">
                                {formatCurrency(factura.rubro_total)}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {factura.pedido_data ? (
                                <div>
                                  <strong>
                                    Pedido #{typeof factura.pedido === 'number' ? factura.pedido : factura.pedido?.id}
                                  </strong>
                                  {' '}
                                  —
                                  {' '}
                                  {factura.pedido_data.fecha}
                                  {factura.pedido_data.vip && (
                                    <span className="badge bg-warning text-dark ms-2">
                                      VIP ⭐
                                    </span>
                                  )}
                                </div>
                              ) : factura.pedido ? (
                                <div>
                                  <strong>
                                    Pedido #{typeof factura.pedido === 'number' ? factura.pedido : factura.pedido?.id}
                                  </strong>
                                </div>
                              ) : (
                                <em className="text-muted">Sin pedido asociado</em>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {factura.pedido_data ? (
                                <span 
                                  className="badge"
                                  style={{
                                    backgroundColor: 
                                      factura.pedido_data.estado === 'Verificado' ? '#198754' :
                                      factura.pedido_data.estado === 'Empacado x despachar' ? '#0dcaf0' :
                                      factura.pedido_data.estado === 'Despachado' ? '#6610f2' :
                                      '#6c757d',
                                    color: 'white',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {factura.pedido_data.estado}
                                </span>
                              ) : (
                                <em className="text-muted">-</em>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {factura.pedido_data && 
                               factura.pedido_data.estado === 'Empacado x despachar' && 
                               typeof factura.pedido === 'number' ? (
                                <button
                                  className="btn btn-sm btn-primary"
                                  onClick={() => handleDespacharClick(factura.pedido as number)}
                                  style={{
                                    backgroundColor: '#0E2EB0',
                                    borderColor: '#0E2EB0',
                                    transition: 'all 0.3s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0a1f7a';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0E2EB0';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                  }}
                                >
                                  <span className="me-1">📦</span>
                                  Despachar
                                </button>
                              ) : factura.pedido_data && factura.pedido_data.estado === 'Despachado' ? (
                                <span className="badge bg-success">
                                  <span className="me-1">✓</span>
                                  Despachado
                                </span>
                              ) : (
                                <span className="text-muted small">-</span>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-5">
                            <div className="py-3">
                              <span className="fs-1 mb-3 d-block">📭</span>
                              <p className="mb-0">No hay facturas pendientes.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          {facturas.length > 0 && (
            <div className="card border-0 bg-light mt-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-secondary mb-3">
                  <span className="me-2">ℹ️</span>
                  Información
                </h6>
                <ul className="list-unstyled mb-0">
                  <li className="mb-2">
                    <span className="text-primary me-2">•</span>
                    Las facturas se generan automáticamente al crear un pedido verificado
                  </li>
                  <li className="mb-2">
                    <span className="text-primary me-2">•</span>
                    Cada factura está asociada a un único pedido
                  </li>
                  <li className="mb-0">
                    <span className="text-primary me-2">•</span>
                    El total de la factura se calcula sumando los subtotales de todos los productos del pedido
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedPedidoId && (
        <DespacharPedidoModal
          show={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDespacho}
          pedidoId={selectedPedidoId}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default FacturasPendientes;
