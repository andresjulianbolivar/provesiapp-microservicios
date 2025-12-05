import React, { useState } from 'react';
import { crearCotizacion } from '../api/cotizaciones';

const CrearCotizacion: React.FC = () => {
  const [pedidoId, setPedidoId] = useState<string>('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!pedidoId) {
      setError('Por favor ingrese un ID de pedido válido.');
      return;
    }

    try {
      setLoading(true);
      const resp = await crearCotizacion(Number(pedidoId));
      setMensaje(resp.mensaje || 'Cotización creada correctamente.');
      setPedidoId('');
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
        'Error al crear la cotización. Verifica el ID y el estado del pedido.'
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
              Crear Cotización
            </h2>
            <p className="text-muted">
              Genera cotizaciones de transporte para pedidos verificados
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
              <h5 className="mb-0">
                <span className="me-2">📝</span>
                Datos del Pedido
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="pedido_id" className="form-label fw-semibold">
                    ID del Pedido Verificado
                    <span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="number"
                    name="pedido_id"
                    id="pedido_id"
                    className="form-control form-control-lg"
                    placeholder="Ejemplo: 123"
                    required
                    min={1}
                    value={pedidoId}
                    onChange={(e) => setPedidoId(e.target.value)}
                  />
                  <div className="form-text mt-2">
                    <span className="me-2">ℹ️</span>
                    Asegúrate de ingresar un ID de pedido que ya esté en estado
                    {' '}
                    <strong>&quot;Empacado x despachar&quot;</strong>
                    .
                  </div>
                </div>

                <div className="alert alert-light border" role="alert">
                  <h6 className="alert-heading mb-2">
                    <span className="me-2">📌</span>
                    Importante
                  </h6>
                  <p className="mb-0 small">
                    La cotización se generará automáticamente consultando diferentes
                    transportadoras disponibles. El proceso puede tomar unos segundos.
                  </p>
                </div>

                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-lg text-white"
                    disabled={loading}
                    style={{ backgroundColor: '#0E2EB0', borderColor: '#0E2EB0' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Creando cotización...
                      </>
                    ) : (
                      <>
                        <span className="me-2">🚀</span>
                        Crear Cotización
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="card border-0 bg-light mt-4">
            <div className="card-body p-4">
              <h6 className="fw-bold text-secondary mb-3">¿Qué sucede después?</h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <span className="text-primary me-2">1.</span>
                  Se consultarán múltiples transportadoras
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">2.</span>
                  Se generarán las cotizaciones con precios y tiempos estimados
                </li>
                <li className="mb-0">
                  <span className="text-primary me-2">3.</span>
                  Podrás consultar las cotizaciones en la sección
                  {' '}
                  <strong>&quot;Cotizaciones&quot;</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearCotizacion;
