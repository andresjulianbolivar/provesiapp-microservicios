import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top"
      style={{ borderBottom: '2px solid #0E2EB0' }}
    >
      <div className="container-fluid px-4">
        <Link 
          className="navbar-brand fw-bold text-primary" 
          to="/"
          style={{ fontSize: '1.5rem', color: '#0E2EB0' }}
        >
          <span style={{ 
            background: 'linear-gradient(135deg, #0E2EB0 0%, #1e4fd8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            Provesi App
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 ${isActive ? 'fw-bold' : ''}`
                }
                to="/inventarios"
                style={({ isActive }) => ({
                  color: isActive ? '#0E2EB0' : '#6c757d',
                  borderBottom: isActive ? '2px solid #0E2EB0' : 'none'
                })}
              >
                Inventarios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 ${isActive ? 'fw-bold' : ''}`
                }
                to="/consultar-stock"
                style={({ isActive }) => ({
                  color: isActive ? '#0E2EB0' : '#6c757d',
                  borderBottom: isActive ? '2px solid #0E2EB0' : 'none'
                })}
              >
                Consultar Stock
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 ${isActive ? 'fw-bold' : ''}`
                }
                to="/crear-cotizacion"
                style={({ isActive }) => ({
                  color: isActive ? '#0E2EB0' : '#6c757d',
                  borderBottom: isActive ? '2px solid #0E2EB0' : 'none'
                })}
              >
                Crear Cotización
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link px-3 ${isActive ? 'fw-bold' : ''}`
                }
                to="/cotizaciones"
                style={({ isActive }) => ({
                  color: isActive ? '#0E2EB0' : '#6c757d',
                  borderBottom: isActive ? '2px solid #0E2EB0' : 'none'
                })}
              >
                Cotizaciones
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle px-3 btn btn-link text-decoration-none"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: '#6c757d' }}
              >
                Facturaciones
              </button>
              <ul className="dropdown-menu">
                <li>
                  <NavLink className="dropdown-item" to="/facturaciones/crear-pedido">
                    Crear Pedido
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/facturaciones/crear-factura">
                    Crear Factura
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <NavLink className="dropdown-item" to="/facturaciones/facturas-pendientes">
                    Facturas Pendientes
                  </NavLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
