import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Hero Section */}
          <div className="text-center mb-5">
            <h1 
              className="display-4 fw-bold mb-3"
              style={{ 
                color: '#0E2EB0',
                background: 'linear-gradient(135deg, #0E2EB0 0%, #1e4fd8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Provesi App
            </h1>
            <p className="lead text-muted mb-4">
              Panel de gestión de inventarios, pedidos y cotizaciones
            </p>
            <div className="bg-light p-4 rounded shadow-sm">
              <p className="mb-0 text-secondary">
                Sistema integral para la administración y control de productos,
                stock en bodegas y gestión de cotizaciones de transporte.
              </p>
            </div>
          </div>

          {/* Dashboard Cards */}
          <div className="row g-4 mt-4">
            <div className="col-md-4">
              <Link to="/consultar-stock" className="text-decoration-none">
                <div 
                  className="card h-100 shadow-sm border-0"
                  style={{ 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 46, 176, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div 
                    className="card-body text-center p-4"
                    style={{ borderTop: '4px solid #0E2EB0' }}
                  >
                    <div 
                      className="mb-3"
                      style={{ 
                        fontSize: '3rem',
                        color: '#0E2EB0'
                      }}
                    >
                      📦
                    </div>
                    <h5 className="card-title fw-bold" style={{ color: '#0E2EB0' }}>
                      Consultar Stock
                    </h5>
                    <p className="card-text text-muted">
                      Verifica disponibilidad de productos por código de barras o QR
                    </p>
                    <span className="btn btn-outline-primary btn-sm mt-2">
                      Consultar →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/cotizaciones" className="text-decoration-none">
                <div 
                  className="card h-100 shadow-sm border-0"
                  style={{ 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 46, 176, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div 
                    className="card-body text-center p-4"
                    style={{ borderTop: '4px solid #0E2EB0' }}
                  >
                    <div 
                      className="mb-3"
                      style={{ 
                        fontSize: '3rem',
                        color: '#0E2EB0'
                      }}
                    >
                      📋
                    </div>
                    <h5 className="card-title fw-bold" style={{ color: '#0E2EB0' }}>
                      Cotizaciones
                    </h5>
                    <p className="card-text text-muted">
                      Consulta y gestiona cotizaciones de transporte para pedidos
                    </p>
                    <span className="btn btn-outline-primary btn-sm mt-2">
                      Ver Cotizaciones →
                    </span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-4">
              <Link to="/inventarios" className="text-decoration-none">
                <div 
                  className="card h-100 shadow-sm border-0"
                  style={{ 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 46, 176, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div 
                    className="card-body text-center p-4"
                    style={{ borderTop: '4px solid #0E2EB0' }}
                  >
                    <div 
                      className="mb-3"
                      style={{ 
                        fontSize: '3rem',
                        color: '#0E2EB0'
                      }}
                    >
                      📊
                    </div>
                    <h5 className="card-title fw-bold" style={{ color: '#0E2EB0' }}>
                      Inventarios
                    </h5>
                    <p className="card-text text-muted">
                      Visualiza el inventario completo de todas las bodegas
                    </p>
                    <span className="btn btn-outline-primary btn-sm mt-2">
                      Ver Inventarios →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 bg-light">
                <div className="card-body p-4">
                  <h5 className="card-title text-center mb-3" style={{ color: '#0E2EB0' }}>
                    Funcionalidades Principales
                  </h5>
                  <div className="row text-center">
                    <div className="col-md-4 mb-3 mb-md-0">
                      <div className="p-3">
                        <h6 className="fw-bold text-secondary">Gestión de Stock</h6>
                        <p className="small text-muted mb-0">
                          Control en tiempo real del inventario en múltiples bodegas
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3 mb-md-0">
                      <div className="p-3">
                        <h6 className="fw-bold text-secondary">Cotizaciones</h6>
                        <p className="small text-muted mb-0">
                          Genera y compara cotizaciones de diferentes transportadoras
                        </p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3">
                        <h6 className="fw-bold text-secondary">Reportes</h6>
                        <p className="small text-muted mb-0">
                          Información detallada de productos, precios y disponibilidad
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
