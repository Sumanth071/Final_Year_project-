import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { TrendingUp, DollarSign, Calendar, ShoppingCart, Users, ChefHat } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard/summary`);
      setSummary(res.data.summary);
      setRecentOrders(res.data.recentOrders);
      setRecentBookings(res.data.recentBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (in a real app, this would come from the API)
  const salesData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 500 },
    { name: 'Thu', sales: 280 },
    { name: 'Fri', sales: 590 },
    { name: 'Sat', sales: 320 },
    { name: 'Sun', sales: 410 },
  ];

  const pieData = [
    { name: 'Dine-in', value: 60 },
    { name: 'Takeaway', value: 30 },
    { name: 'Delivery', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return <Loading message="Loading dashboard data..." />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600">You need to login to view the dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3">
        <ChefHat className="h-8 w-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 card-hover animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600">{summary.totalOrders || 0}</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${summary.totalRevenue || 0}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-purple-600">{summary.totalBookings || 0}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 card-hover animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Orders</p>
              <p className="text-3xl font-bold text-orange-600">{summary.todaysOrders || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Weekly Sales</h3>
          </div>
          <BarChart width={500} height={300} data={salesData} className="w-full">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Order Types</h3>
          </div>
          <PieChart width={500} height={300} className="w-full">
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <ShoppingCart className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Recent Orders</h3>
          </div>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">{order.user?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600">${order.totalAmount}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No recent orders</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-semibold text-gray-900">Recent Bookings</h3>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Booking #{booking._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">{booking.user?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-purple-600">{booking.numberOfGuests} guests</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No recent bookings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
