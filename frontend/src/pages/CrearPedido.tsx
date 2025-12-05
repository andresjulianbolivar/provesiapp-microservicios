import React, { useEffect, useState } from 'react';
import { fetchProductosParaPedido, crearPedido } from '../api/facturaciones';
import { Producto } from '../types/domain';

const CrearPedido: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cantidades, setCantidades] = useState<{ [codigo: number]: number }>({});
  const [vip, setVip] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProductos = async () => {
      try {
        setLoadingProductos(true);
        const data = await fetchProductosParaPedido();
        setProductos(data);
        
        // Inicializar cantidades en 0
        const initialCantidades: { [codigo: number]: number } = {};
        data.forEach((producto) => {
          initialCantidades[producto.codigo] = 0;
        });
        setCantidades(initialCantidades);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError('Error al cargar la lista de productos');
      } finally {
        setLoadingProductos(false);
      }
    };

    loadProductos();
  }, []);

  const handleCantidadChange = (codigo: number, value: string) => {
    const cantidad = parseInt(value) || 0;
    setCantidades((prev) => ({
      ...prev,
      [codigo]: cantidad >= 0 ? cantidad : 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    // Filtrar productos con cantidad > 0
    const items = productos
      .filter((producto) => cantidades[producto.codigo] > 0)
      .map((producto) => ({
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        unidades: cantidades[producto.codigo],
      }));

    if (items.length === 0) {
      setError('Debes agregar al menos un producto con cantidad mayor a 0');
      return;
    }

    try {
      setLoading(true);
      const response = await crearPedido({
        productos_cantidades: items,
        vip,
      });

      setMensaje(
        `Pedido #${response.pedido_id} creado correctamente. Estado: ${response.estado}`
      );

      // Limpiar el formulario
      const resetCantidades: { [codigo: number]: number } = {};
      productos.forEach((producto) => {
        resetCantidades[producto.codigo] = 0;
      });
      setCantidades(resetCantidades);
      setVip(false);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          'Error al crear el pedido. Verifica los datos e intenta nuevamente.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold" style={{ color: '#0E2EB0' }}>
              <span className="me-2">📝</span>
              Crear Pedido
            </h2>
            <p className="text-muted">
              Selecciona los productos y cantidades para crear un nuevo pedido
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
              <h5 className="mb-0">Productos Disponibles</h5>
            </div>
            <div className="card-body p-0">
              {loadingProductos ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando productos...</span>
                  </div>
                  <p className="text-muted mt-3">Cargando productos...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                          <th className="py-3 px-4" style={{ color: '#0E2EB0', width: '70%' }}>
                            Producto
                          </th>
                          <th className="py-3 px-4 text-end" style={{ color: '#0E2EB0', width: '30%' }}>
                            Cantidad
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.length > 0 ? (
                          productos.map((producto) => (
                            <tr key={producto.codigo}>
                              <td className="py-3 px-4">
                                <div>
                                  <strong>{producto.nombre}</strong>
                                  {' '}
                                  <span className="badge bg-secondary">
                                    {producto.codigo}
                                  </span>
                                </div>
                                {producto.descripcion && (
                                  <small className="text-muted">{producto.descripcion}</small>
                                )}
                              </td>
                              <td className="py-3 px-4 text-end">
                                <input
                                  type="number"
                                  className="form-control d-inline-block"
                                  style={{ width: '100px' }}
                                  min="0"
                                  value={cantidades[producto.codigo] || 0}
                                  onChange={(e) =>
                                    handleCantidadChange(producto.codigo, e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={2} className="text-center text-muted py-5">
                              No hay productos disponibles
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* VIP Checkbox and Submit */}
                  <div className="p-4 bg-light border-top">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="vip"
                        checked={vip}
                        onChange={(e) => setVip(e.target.checked)}
                      />
                      <label className="form-check-label fw-semibold" htmlFor="vip">
                        <span className="me-2">⭐</span>
                        Pedido VIP (Prioridad alta)
                      </label>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-lg text-white"
                        disabled={loading || productos.length === 0}
                        style={{ backgroundColor: '#0E2EB0', borderColor: '#0E2EB0' }}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Creando pedido...
                          </>
                        ) : (
                          <>
                            <span className="me-2">🚀</span>
                            Crear Pedido
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="card border-0 bg-light mt-4">
            <div className="card-body p-4">
              <h6 className="fw-bold text-secondary mb-3">
                <span className="me-2">ℹ️</span>
                Información Importante
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <span className="text-primary me-2">•</span>
                  Selecciona las cantidades deseadas para cada producto
                </li>
                <li className="mb-2">
                  <span className="text-primary me-2">•</span>
                  Los pedidos VIP tienen prioridad en el procesamiento
                </li>
                <li className="mb-0">
                  <span className="text-primary me-2">•</span>
                  El pedido se creará en estado &quot;Verificado&quot; por defecto
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrearPedido;
