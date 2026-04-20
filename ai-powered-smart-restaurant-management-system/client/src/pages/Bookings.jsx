import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    table: '',
    date: '',
    time: '',
    duration: 2,
    numberOfGuests: 1,
    specialRequests: '',
  });

  useEffect(() => {
    fetchBookings();
    fetchTables();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`);
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tables`);
      setTables(res.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, formData);
      fetchBookings();
      resetForm();
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/bookings/${bookingId}`, { status: newStatus });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      table: '',
      date: '',
      time: '',
      duration: 2,
      numberOfGuests: 1,
      specialRequests: '',
    });
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Booking Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Booking
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Booking</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Table</label>
                <select
                  value={formData.table}
                  onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="">Select Table</option>
                  {tables.map(table => (
                    <option key={table._id} value={table._id}>
                      Table {table.number} (Capacity: {table.capacity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Duration (hours)</label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 2 })}
                  className="w-full px-3 py-2 border rounded"
                  min="1"
                  max="8"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Number of Guests</label>
                <input
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({ ...formData, numberOfGuests: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-2 border rounded"
                  min="1"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="3"
                placeholder="Any special requests or requirements..."
              />
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Booking
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">
                  Booking #{booking._id.slice(-6)}
                </h3>
                <p className="text-gray-600">
                  Table {booking.table?.number} - {booking.numberOfGuests} guests
                </p>
                <p className="text-gray-600">
                  {new Date(booking.date).toLocaleDateString()} at {booking.time}
                </p>
                <p className="text-gray-600">Duration: {booking.duration} hours</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(booking.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Special Requests:</h4>
                <p className="text-gray-700">{booking.specialRequests}</p>
              </div>
            )}

            {(user?.role === 'restaurantadmin' || user?.role === 'staff') && (
              <div className="flex gap-2">
                {booking.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Confirm
                  </button>
                )}
                {['pending', 'confirmed'].includes(booking.status) && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Cancel
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;