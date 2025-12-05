import React, { useEffect, useState } from 'react';
import { fetchPedidosVerificados, crearFactura } from '../api/facturaciones';
import { Pedido } from '../types/domain';

const CrearFactura: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [selectedPedidoId, setSelectedPedidoId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPedidos = async () => {
      try {
        setLoadingPedidos(true);
        const data = await fetchPedidosVerificados();
        setPedidos(data);
      } catch (err) {
        console.error('Error al cargar pedidos verificados:', err);
        setError('Error al cargar la lista de pedidos verificados');
      } finally {
        setLoadingPedidos(false);
      }
    };

    loadPedidos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!selectedPedidoId) {
      setError('Por favor selecciona un pedido');
      return;
    }

    try {
      setLoading(true);
      const response = await crearFactura(Number(selectedPedidoId));
      setMensaje(response.mensaje);
      setSelectedPedidoId('');
      
      // Recargar pedidos después de crear la factura
      const data = await fetchPedidosVerificados();
      setPedidos(data);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Error al crear la factura. Verifica que el pedido esté en estado Verificado.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 
              className="fw-bold mb-2"
              style={{ color: '#0E2EB0' }}
            >
              <span className="me-2">🧾</span>
              Crear Factura
            </h2>
            <p className="text-muted">
              Genera una factura para un pedido verificado
            </p>
          </div>

          {/* Messages */}
          {mensaje && (
            <div className="alert alert-success alert-dismissible fade show shadow-sm mb-4" role="alert">
              <div className="d-flex align-items-center">
                <span className="fs-4 me-3">✅</span>
                <div>
                  <strong>¡Éxito!</strong>
                  {' '}
                  {mensaje}
                </div>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          {error && (
            <div className="alert alert-danger alert-dismissible fade show shadow-sm mb-4" role="alert">
              <div className="d-flex align-items-center">
                <span className="fs-4 me-3">❌</span>
                <div>
                  <strong>Error:</strong>
                  {' '}
                  {error}
                </div>
              </div>
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          {/* Form Card */}
          <div className="card border-0 shadow-sm">
            <div 
              className="card-header text-white py-3"
              style={{ backgroundColor: '#0E2EB0' }}
            >
              <h5 className="mb-0">Seleccionar Pedido</h5>
            </div>
            <div className="card-body p-4">
              {loadingPedidos ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando pedidos...</span>
                  </div>
                  <p className="text-muted mt-3">Cargando pedidos verificados...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="pedido_id" className="form-label fw-semibold">
                      Selecciona un pedido verificado:
                      <span className="text-danger ms-1">*</span>
                    </label>
                    <select
                      name="pedido_id"
                      id="pedido_id"
                      className="form-select form-select-lg"
                      required
                      value={selectedPedidoId}
                      onChange={(e) => setSelectedPedidoId(e.target.value)}
                    >
                      <option value="">-- Selecciona un pedido --</option>
                      {pedidos.length > 0 ? (
                        pedidos.map((pedido) => (
                          <option key={pedido.id} value={pedido.id}>
                            Pedido #{pedido.id} - {pedido.fecha} - VIP: {pedido.vip ? 'Sí' : 'No'}
                          </option>
                        ))
                      ) : (
                        <option disabled>No hay pedidos verificados disponibles</option>
                      )}
                    </select>
                    {pedidos.length === 0 && (
                      <div className="form-text text-warning mt-2">
                        <span className="me-2">⚠️</span>
                        No hay pedidos en estado &quot;Verificado&quot; disponibles para facturar.
                      </div>
                    )}
                  </div>

                  <div className="alert alert-light border" role="alert">
                    <h6 className="alert-heading mb-2">
                      <span className="me-2">📌</span>
                      Importante
                    </h6>
                    <p className="mb-0 small">
                      Solo se pueden crear facturas para pedidos que estén en estado
                      {' '}
                      <strong>&quot;Verificado&quot;</strong>
                      . Una vez creada la factura,
                      el pedido pasará al estado
                      {' '}
                      <strong>&quot;Empacado x despachar&quot;</strong>
                      .
                    </p>
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-lg text-white"
                      disabled={loading || pedidos.length === 0 || !selectedPedidoId}
                      style={{ backgroundColor: '#0E2EB0', borderColor: '#0E2EB0' }}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Creando factura...
                        </>
                      ) : (
                        <>
                          <span className="me-2">📄</span>
                          Crear Factura
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Info Card */}
          {pedidos.length > 0 && (
            <div className="card border-0 bg-light mt-4">
              <div className="card-body p-4">
                <h6 className="fw-bold text-secondary mb-3">Pedidos Disponibles</h6>
                <p className="small text-muted mb-2">
                  Actualmente hay
                  {' '}
                  <strong>{pedidos.length}</strong>
                  {' '}
                  {pedidos.length === 1 ? 'pedido verificado' : 'pedidos verificados'}
                  {' '}
                  disponible{pedidos.length === 1 ? '' : 's'} para facturar.
                </p>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {pedidos.map((pedido) => (
                    <span
                      key={pedido.id}
                      className="badge bg-secondary"
                      style={{ fontSize: '0.9rem' }}
                    >
                      #{pedido.id}
                      {pedido.vip && ' ⭐'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrearFactura;
