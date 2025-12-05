import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CotizacionesList from './pages/CotizacionesList';
import CrearCotizacion from './pages/CrearCotizacion';
import ConsultarStock from './pages/ConsultarStock';
import InventariosList from './pages/InventariosList';
import CrearPedido from './pages/CrearPedido';
import CrearFactura from './pages/CrearFactura';
import FacturasPendientes from './pages/FacturasPendientes';

const App: React.FC = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1">
        <div className="container-fluid" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cotizaciones" element={<CotizacionesList />} />
            <Route path="/crear-cotizacion" element={<CrearCotizacion />} />
            <Route path="/consultar-stock" element={<ConsultarStock />} />
            <Route path="/inventarios" element={<InventariosList />} />
            
            {/* Rutas de facturaciones */}
            <Route path="/facturaciones/crear-pedido" element={<CrearPedido />} />
            <Route path="/facturaciones/crear-factura" element={<CrearFactura />} />
            <Route path="/facturaciones/facturas-pendientes" element={<FacturasPendientes />} />
          </Routes>
        </div>
      </main>

      <footer 
        className="mt-auto py-4 border-top"
        style={{ backgroundColor: '#f8f9fa' }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <h6 className="fw-bold" style={{ color: '#0E2EB0' }}>
                Provesi App
              </h6>
              <p className="text-muted small mb-2">
                ISIS-2503 Arquitectura y Diseño de Software
              </p>
              <p className="text-muted small mb-0">
                <em>Iván David Alfonso Díaz</em>
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="text-muted small mb-1">
                Universidad de los Andes
              </p>
              <p className="text-muted small mb-0">
                © 2025 - Sistema de Gestión de Inventarios
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
