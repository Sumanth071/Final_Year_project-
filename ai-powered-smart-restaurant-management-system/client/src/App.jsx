import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Restaurants from './pages/Restaurants';
import Menu from './pages/Menu';
import Tables from './pages/Tables';
import Bookings from './pages/Bookings';
import Orders from './pages/Orders';
import Reservations from './pages/Reservations';
import Users from './pages/Users';
import Reports from './pages/Reports';
import AIInsights from './pages/AIInsights';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/tables" element={<Tables />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/users" element={<Users />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/ai-insights" element={<AIInsights />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;