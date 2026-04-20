import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useAuth } from '../context/AuthContext';

const Reports = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reports/overview`, {
        params: dateRange,
      });
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="px-3 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="px-3 py-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${reports.orderStats?.totalRevenue || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl font-bold text-blue-600">{reports.orderStats?.totalOrders || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Total Bookings</h3>
          <p className="text-2xl font-bold text-purple-600">{reports.bookingStats?.totalBookings || 0}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Average Order Value</h3>
          <p className="text-2xl font-bold text-orange-600">${reports.orderStats?.averageOrderValue?.toFixed(2) || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          {reports.revenueTrend && reports.revenueTrend.length > 0 ? (
            <LineChart width={500} height={300} data={reports.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Order Types Distribution */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Order Types</h3>
          {reports.orderTypes && reports.orderTypes.length > 0 ? (
            <PieChart width={400} height={300}>
              <Pie
                data={reports.orderTypes}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reports.orderTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Popular Menu Items */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Popular Menu Items</h3>
          {reports.popularItems && reports.popularItems.length > 0 ? (
            <BarChart width={500} height={300} data={reports.popularItems.map(item => ({
              name: `Item ${item._id.slice(-4)}`,
              orders: item.totalQuantity,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="orders" fill="#82ca9d" />
            </BarChart>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        {/* Peak Hours */}
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Peak Hours</h3>
          {reports.busyHours && reports.busyHours.length > 0 ? (
            <BarChart width={500} height={300} data={reports.busyHours.map(hour => ({
              hour: `${hour._id}:00`,
              bookings: hour.count,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#ffc658" />
            </BarChart>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>
      </div>

      {/* Order and Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Order Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Orders:</span>
              <span className="font-medium">{reports.orderStats?.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed:</span>
              <span className="font-medium text-green-600">{reports.orderStats?.completedOrders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-medium text-yellow-600">{reports.orderStats?.pendingOrders || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold mb-4">Booking Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Bookings:</span>
              <span className="font-medium">{reports.bookingStats?.totalBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Confirmed:</span>
              <span className="font-medium text-green-600">{reports.bookingStats?.confirmedBookings || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancelled:</span>
              <span className="font-medium text-red-600">{reports.bookingStats?.cancelledBookings || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;