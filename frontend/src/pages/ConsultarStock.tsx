import React, { useEffect, useState } from 'react';
import { consultarStockPorCodigo, fetchInventarios } from '../api/inventarios';
import { Producto, Inventario, Bodega } from '../types/domain';

const ConsultarStock: React.FC = () => {
  const [codigo, setCodigo] = useState('');
  const [producto, setProducto] = useState<Producto | null>(null);
  const [stock, setStock] = useState<Inventario[] | null>(null);
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [loadingConsulta, setLoadingConsulta] = useState(false);
  const [loadingInventarios, setLoadingInventarios] = useState(false);

  useEffect(() => {
    const loadInventarios = async () => {
      try {
        setLoadingInventarios(true);
        const data = await fetchInventarios();
        setInventarios(data);
      } catch (err) {
        console.error('Error al cargar inventarios:', err);
      } finally {
        setLoadingInventarios(false);
      }
    };

    loadInventarios();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensajeError(null);
    setProducto(null);
    setStock(null);

    if (!codigo.trim()) {
      setMensajeError('Por favor ingrese un código.');
      return;
    }

    try {
      setLoadingConsulta(true);
      const resp = await consultarStockPorCodigo(codigo);
      if (!resp.producto) {
        setMensajeError('Producto no encontrado. Verifique el código ingresado.');
        setStock([]);
      } else {
        setProducto(resp.producto);
        setStock(resp.stock);
      }
    } catch (err) {
      setMensajeError('Error al consultar el producto.');
      console.error(err);
    } finally {
      setLoadingConsulta(false);
    }
  };

  const getBodegaNombre = (bodega: Bodega | number): string => {
    if (typeof bodega === 'number') return `Bodega ${bodega}`;
    return `${bodega.ciudad} - ${bodega.direccion}`;
  };

  const getProductoNombre = (producto: Producto | number): string => {
    if (typeof producto === 'number') return `Producto ${producto}`;
    return producto.nombre;
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold" style={{ color: '#0E2EB0' }}>
              <span className="me-2">📦</span>
              Consultar Disponibilidad
            </h2>
            <p className="text-muted">
              Consulta el stock disponible de productos mediante código de barras o QR
            </p>
          </div>

          {/* Search Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light py-3">
              <h5 className="mb-0 text-secondary">
                <span className="me-2">🔍</span>
                Buscar Producto
              </h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="codigo" className="form-label fw-semibold">
                    Código de barras o QR:
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="codigo"
                    id="codigo"
                    required
                    placeholder="Escanea o ingresa el código del producto"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-lg text-white px-4"
                  disabled={loadingConsulta}
                  style={{ backgroundColor: '#0E2EB0', borderColor: '#0E2EB0' }}
                >
                  {loadingConsulta ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Consultando...
                    </>
                  ) : (
                    'Consultar Stock'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Product Info Card */}
          {producto && (
            <>
              <div className="card border-0 shadow-sm mb-4" style={{ borderLeft: '4px solid #0E2EB0' }}>
                <div className="card-body p-4">
                  <h4 className="mb-3" style={{ color: '#0E2EB0' }}>
                    {producto.nombre}
                  </h4>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong className="text-secondary">Código:</strong>
                        {' '}
                        <span className="badge bg-secondary">{producto.codigo}</span>
                      </p>
                      <p className="mb-2">
                        <strong className="text-secondary">Color:</strong>
                        {' '}
                        {producto.color}
                      </p>
                      <p className="mb-2">
                        <strong className="text-secondary">Talla:</strong>
                        {' '}
                        {producto.talla}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong className="text-secondary">Descripción:</strong>
                        {' '}
                        {producto.descripcion}
                      </p>
                      <p className="mb-0">
                        <strong className="text-secondary">Precio:</strong>
                        {' '}
                        <span className="fs-5 fw-bold text-success">
                          ${producto.precio.toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stock Table Card */}
              <div className="card border-0 shadow-sm mb-4">
                <div 
                  className="card-header text-white py-3"
                  style={{ backgroundColor: '#0E2EB0' }}
                >
                  <h5 className="mb-0">Stock Disponible</h5>
                </div>
                <div className="card-body p-0">
                  {stock && stock.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th className="py-3 px-4">Bodega</th>
                            <th className="py-3 px-4">Cantidad Disponible</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stock.map((item) => (
                            <tr key={item.id}>
                              <td className="py-3 px-4">
                                <span className="fw-semibold">
                                  {getBodegaNombre(item.bodega as Bodega | number)}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span 
                                  className="badge fs-6"
                                  style={{ 
                                    backgroundColor: item.cantidad > 10 ? '#198754' : item.cantidad > 0 ? '#ffc107' : '#dc3545',
                                    color: item.cantidad > 10 || item.cantidad === 0 ? 'white' : 'black'
                                  }}
                                >
                                  {item.cantidad}
                                  {' '}
                                  unidades
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-warning m-3 mb-0">
                      <div className="d-flex align-items-center">
                        <span className="fs-4 me-3">⚠️</span>
                        <div>
                          <strong>Sin stock:</strong>
                          {' '}
                          Este producto no tiene stock disponible en ninguna bodega.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Error Messages */}
          {mensajeError && (
            <div className="alert alert-danger shadow-sm" role="alert">
              <div className="d-flex align-items-center">
                <span className="fs-4 me-3">❌</span>
                <div>
                  <strong>Error:</strong>
                  {' '}
                  {mensajeError}
                </div>
              </div>
            </div>
          )}

          {/* Complete Inventory List */}
          <hr className="my-5" />

          <div className="card border-0 shadow-sm">
            <div 
              className="card-header text-white py-3"
              style={{ backgroundColor: '#0E2EB0' }}
            >
              <h5 className="mb-0">
                <span className="me-2">📊</span>
                Listado Completo de Inventarios
              </h5>
            </div>
            <div className="card-body p-0">
              {loadingInventarios ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="text-muted mt-3">Cargando inventarios...</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                      <tr>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0' }}>Producto</th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0' }}>Bodega</th>
                        <th className="py-3 px-4" style={{ color: '#0E2EB0' }}>Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventarios.map((inv) => (
                        <tr key={inv.id}>
                          <td className="py-3 px-4 fw-semibold">
                            {getProductoNombre(inv.producto as Producto | number)}
                          </td>
                          <td className="py-3 px-4">
                            {getBodegaNombre(inv.bodega as Bodega | number)}
                          </td>
                          <td className="py-3 px-4">
                            <span className="badge bg-info text-dark fs-6">
                              {inv.cantidad}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultarStock;
