import React, { useEffect, useState } from 'react';
import { fetchInventarios } from '../api/inventarios';
import { Inventario, Bodega, Producto } from '../types/domain';

const InventariosList: React.FC = () => {
  const [inventarios, setInventarios] = useState<Inventario[]>([]);
  const [filteredInventarios, setFilteredInventarios] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getBodegaNombre = (bodega: Bodega | number): string => {
    if (typeof bodega === 'number') return `Bodega ${bodega}`;
    return `${bodega.ciudad} - ${bodega.direccion}`;
  };

  const getProductoNombre = (producto: Producto | number): string => {
    if (typeof producto === 'number') return `Producto ${producto}`;
    return producto.nombre;
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchInventarios();
        setInventarios(data);
        setFilteredInventarios(data);
      } catch (err) {
        setError('Error al cargar inventarios');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInventarios(inventarios);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = inventarios.filter((inv) => {
      const productoNombre = getProductoNombre(inv.producto as Producto | number).toLowerCase();
      const bodegaNombre = getBodegaNombre(inv.bodega as Bodega | number).toLowerCase();
      return productoNombre.includes(term) || bodegaNombre.includes(term);
    });
    setFilteredInventarios(filtered);
  }, [searchTerm, inventarios]);

  const getTotalItems = () => {
    return filteredInventarios.reduce((sum, inv) => sum + inv.cantidad, 0);
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="mb-4">
            <h2 className="fw-bold" style={{ color: '#0E2EB0' }}>
              <span className="me-2">📊</span>
              Inventarios
            </h2>
            <p className="text-muted">
              Visualiza y gestiona el inventario completo de productos en todas las bodegas
            </p>
          </div>

          {/* Stats Cards */}
          {!loading && !error && (
            <div className="row mb-4">
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <h3 className="mb-2" style={{ color: '#0E2EB0' }}>
                      {filteredInventarios.length}
                    </h3>
                    <p className="text-muted mb-0">Registros de Inventario</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3 mb-md-0">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <h3 className="mb-2 text-success">
                      {getTotalItems()}
                    </h3>
                    <p className="text-muted mb-0">Unidades Totales</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <h3 className="mb-2 text-info">
                      {new Set(inventarios.map(inv => 
                        typeof inv.bodega === 'number' ? inv.bodega : inv.bodega.id
                      )).size}
                    </h3>
                    <p className="text-muted mb-0">Bodegas Activas</p>
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

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="text-muted mt-3">Cargando inventarios...</p>
            </div>
          ) : (
            <>
              {/* Search and Table Card */}
              <div className="card border-0 shadow-sm">
                <div 
                  className="card-header text-white py-3"
                  style={{ backgroundColor: '#0E2EB0' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Listado de Inventarios</h5>
                    <span className="badge bg-light text-dark">
                      {filteredInventarios.length}
                      {' '}
                      registros
                    </span>
                  </div>
                </div>
                <div className="card-body p-4">
                  {/* Search Input */}
                  <div className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <span style={{ fontSize: '1.1rem' }}>🔍</span>
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0 ps-0"
                        placeholder="Buscar por producto o bodega..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setSearchTerm('')}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table */}
                  {filteredInventarios.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover mb-0">
                        <thead style={{ backgroundColor: '#f8f9fa' }}>
                          <tr>
                            <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                              ID
                            </th>
                            <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                              Producto
                            </th>
                            <th className="py-3 px-4" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                              Bodega
                            </th>
                            <th className="py-3 px-4 text-center" style={{ color: '#0E2EB0', fontWeight: '600' }}>
                              Cantidad
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInventarios.map((inv) => (
                            <tr key={inv.id}>
                              <td className="py-3 px-4">
                                <span className="badge bg-secondary">{inv.id}</span>
                              </td>
                              <td className="py-3 px-4 fw-semibold">
                                {getProductoNombre(inv.producto as Producto | number)}
                              </td>
                              <td className="py-3 px-4">
                                {getBodegaNombre(inv.bodega as Bodega | number)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span 
                                  className="badge fs-6"
                                  style={{
                                    backgroundColor: inv.cantidad > 50 ? '#198754' : 
                                                   inv.cantidad > 20 ? '#0dcaf0' :
                                                   inv.cantidad > 10 ? '#ffc107' : '#dc3545',
                                    color: inv.cantidad > 20 || inv.cantidad <= 10 ? 'white' : 'black'
                                  }}
                                >
                                  {inv.cantidad}
                                  {' '}
                                  {inv.cantidad === 1 ? 'unidad' : 'unidades'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="alert alert-info mb-0">
                      <div className="d-flex align-items-center">
                        <span className="fs-4 me-3">ℹ️</span>
                        <div>
                          {searchTerm ? (
                            <>
                              <strong>Sin resultados:</strong>
                              {' '}
                              No se encontraron inventarios que coincidan con &quot;
                              {searchTerm}
                              &quot;
                            </>
                          ) : (
                            <>
                              <strong>Sin datos:</strong>
                              {' '}
                              No hay inventarios registrados.
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventariosList;
