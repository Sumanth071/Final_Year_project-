import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChefHat, LogOut, User, BarChart3, Calendar, ClipboardList, Users, FileText, Brain } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: BarChart3 },
    { to: '/restaurants', label: 'Restaurants', icon: ChefHat },
    { to: '/menu', label: 'Menu', icon: ClipboardList },
    { to: '/tables', label: 'Tables', icon: Calendar },
    { to: '/bookings', label: 'Bookings', icon: Calendar },
    { to: '/orders', label: 'Orders', icon: ClipboardList },
    { to: '/reservations', label: 'Reservations', icon: Calendar },
    { to: '/users', label: 'Users', icon: Users },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/ai-insights', label: 'AI Insights', icon: Brain },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 text-white text-2xl font-bold hover:text-blue-100 transition-colors">
            <ChefHat size={32} />
            <span>Smart Restaurant</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-white">
                  <User size={20} />
                  <span>Welcome, {user.name}</span>
                </div>
                <div className="flex space-x-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center space-x-1 text-white hover:text-blue-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-blue-200 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-lg mt-4 p-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-white mb-4 pb-4 border-b border-white/20">
                  <User size={20} />
                  <span>Welcome, {user.name}</span>
                </div>
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/10 block"
                      onClick={() => setIsOpen(false)}
                    >
                      <item.icon size={18} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  className="block text-white hover:text-blue-200 transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-white text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;