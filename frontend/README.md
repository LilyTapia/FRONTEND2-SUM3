# Colomba · Centro de eventos (React + Vite + Tailwind)

SPA que consume un backend mock (REST y GraphQL) para listar eventos y ver sus detalles. Incluye gestión local de “entradas guardadas” (localStorage) y UI responsive.

## Estructura
- `backend/index.js`: Express + ApolloServer. Endpoints REST `/api/events`, `/api/events/:id` y GraphQL `/graphql`. Catálogo mock con imágenes oficiales de Puntoticket.
- `frontend/src/api/events.js`: llamadas REST/GraphQL.
- `frontend/src/context/EventContext.jsx`: estado global (eventos, loading/error, guardados en localStorage, stats).
- `frontend/src/components/`: Navbar, EventCard.
- `frontend/src/pages/`: Home, AllEvents (cartelera con filtros), EventDetail, MyTickets.
- `frontend/src/utils/eventMedia.js`: fallback de imágenes por categoría.

## Requisitos previos
- Node 18+.

## Instalación
```bash
cd backend
npm install
cd ../frontend
npm install
```

## Ejecución en desarrollo
En dos terminales:
```bash
# Terminal 1: backend
cd backend
node index.js

# Terminal 2: frontend
cd frontend
npm run dev
```
Frontend suele quedar en `http://localhost:5173`, backend en `http://localhost:4000`.

## Scripts
- Frontend: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.
- Backend: no tiene scripts; se ejecuta con `node index.js`.

## Endpoints mock
- REST listado: `GET http://localhost:4000/api/events`
- REST detalle: `GET http://localhost:4000/api/events/:id`
- GraphQL: `POST http://localhost:4000/graphql`

## Variables de entorno (opcional)
- `VITE_API_URL`: URL base del backend (sin slash final). Ejemplo: `http://localhost:4000` o la URL donde lo despliegues. Si no se define o falla la llamada, el frontend usa el catálogo mock embebido (`src/api/mockEvents.js`) para no romper la demo.

## Notas de funcionalidad
- Cartelera (`/agenda`): filtros por categoría y búsqueda por nombre/ubicación (REST).
- Detalle (`/evento/:id`): consulta principal por GraphQL con fallback REST; muestra imagen, organizador, aforo y ocupación.
- Guardados (`/mis-pases`): usa localStorage; botón “Cancelar reserva” en coral sólido.
- Navbar: acceso directo a cartelera y mis entradas; contador de guardados.

## Despliegue en GitHub Pages
La app está configurada con `base: '/FRONTEND2-SUM2/'` en `vite.config.js` y `BrowserRouter` usa ese `basename`. Para publicar:
```bash
cd frontend
# (opcional) define VITE_API_URL antes del build si tienes backend desplegado
VITE_API_URL=https://tu-backend.com npm run build
npx gh-pages -d dist -b gh-pages
```
Si no defines `VITE_API_URL`, la versión publicada usará los datos mock internos para evitar el “Failed to fetch”.

## Pruebas rápidas sugeridas
- Navegadores: Chrome/Firefox/Edge desktop. Verificar carga de imágenes, navegación y guardados.
- Responsive: revisar navbar/hero/cards en mobile/tablet.
- Sin backend: validar que en GitHub Pages carga la cartelera con datos mock y no muestra errores.
- Con backend: al definir `VITE_API_URL`, validar REST (cartelera) y GraphQL (detalle) sin errores.

## Licencia
Uso académico/demostrativo (mock). Imágenes referenciales de Puntoticket.***
