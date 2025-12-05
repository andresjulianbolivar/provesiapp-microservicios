# Provesi App - Frontend

SPA en React + TypeScript + Vite para consumir microservicios Django.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install
```

## 🔧 Ejecución

```bash
# Modo desarrollo (puerto 5173)
npm run dev

# Build para producción
npm run build

# Preview del build
npm preview
```

## 📡 Endpoints del Backend

El frontend consume estos endpoints del backend Django:

- `GET /api/cotizaciones/?pedido_id=<id>` - Listar cotizaciones por pedido
- `POST /api/cotizaciones/` - Crear cotización
- `POST /api/consultar-stock/` - Consultar stock por código
- `GET /api/inventarios/` - Listar inventarios

**Backend URL:** `http://localhost:8000/api`

## 📁 Estructura del Proyecto

```
src/
├── api/
│   ├── client.ts          # Cliente Axios configurado
│   ├── cotizaciones.ts    # Servicios de cotizaciones
│   └── inventarios.ts     # Servicios de inventarios
├── components/
│   └── Navbar.tsx         # Barra de navegación
├── pages/
│   ├── Home.tsx           # Página principal
│   ├── CotizacionesList.tsx       # Listar cotizaciones
│   ├── CrearCotizacion.tsx        # Crear cotización
│   ├── ConsultarStock.tsx         # Consultar stock
│   └── InventariosList.tsx        # Listar inventarios
├── types/
│   └── domain.ts          # Tipos TypeScript basados en modelos Django
├── App.tsx                # Componente principal con rutas
└── main.tsx               # Punto de entrada
```

## 🎨 Rutas Disponibles

- `/` - Home (página de bienvenida)
- `/cotizaciones` - Buscar cotizaciones por ID de pedido
- `/crear-cotizacion` - Formulario para crear cotización
- `/consultar-stock` - Consultar stock por código de producto
- `/inventarios` - Listado completo de inventarios
- `/facturaciones/*` - Rutas en construcción

## 🛠️ Tecnologías

- **React 18** - Librería UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool rápido
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Bootstrap 5** - Framework CSS

## 📝 Notas

### Imágenes estáticas

Coloca las imágenes en `/public/static/media/`:
- `logo.png` - Logo de la aplicación
- `fondo.png` - Imagen de fondo para el home

### CORS

El backend Django debe tener CORS configurado para permitir peticiones desde `http://localhost:5173`.

### Proxy

Vite está configurado con proxy para `/api` y `/static` que redirigen a `http://localhost:8000`.

## 🔐 Autenticación

Actualmente el frontend no maneja autenticación. Si el backend requiere Auth0 u otro sistema de autenticación, se debe agregar.

## 🐛 Troubleshooting

**Error de CORS:**
```bash
# Verificar que el backend Django tenga configurado:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
```

**Módulos no encontrados:**
```bash
npm install
```

**Puerto ocupado:**
```bash
# Cambiar puerto en vite.config.ts
server: {
  port: 3000  // o el puerto que prefieras
}
```
