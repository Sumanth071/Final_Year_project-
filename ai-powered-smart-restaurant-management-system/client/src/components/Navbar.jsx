import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Smart Restaurant
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700">Welcome, {user.name}</span>
                <Link to="/" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
                <Link to="/restaurants" className="text-gray-700 hover:text-gray-900">Restaurants</Link>
                <Link to="/menu" className="text-gray-700 hover:text-gray-900">Menu</Link>
                <Link to="/tables" className="text-gray-700 hover:text-gray-900">Tables</Link>
                <Link to="/bookings" className="text-gray-700 hover:text-gray-900">Bookings</Link>
                <Link to="/orders" className="text-gray-700 hover:text-gray-900">Orders</Link>
                <Link to="/reservations" className="text-gray-700 hover:text-gray-900">Reservations</Link>
                <Link to="/users" className="text-gray-700 hover:text-gray-900">Users</Link>
                <Link to="/reports" className="text-gray-700 hover:text-gray-900">Reports</Link>
                <Link to="/ai-insights" className="text-gray-700 hover:text-gray-900">AI Insights</Link>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">Login</Link>
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;