import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import AllEvents from './pages/AllEvents';
import EventDetail from './pages/EventDetail';
import Home from './pages/Home';
import MyTickets from './pages/MyTickets';

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agenda" element={<AllEvents />} />
          <Route path="/evento/:id" element={<EventDetail />} />
          <Route path="/mis-pases" element={<MyTickets />} />
        </Routes>
      </main>
      <footer className="border-t border-sand-200 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-600 md:px-6">
          <span>Frontend II · Sumativa 2 · REST + GraphQL</span>
          <span className="text-brand-700">Datos mock locales (o API en VITE_API_URL)</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
