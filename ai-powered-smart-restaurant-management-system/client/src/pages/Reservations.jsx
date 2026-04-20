import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Reservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'other',
    date: '',
    time: '',
    duration: 3,
    numberOfGuests: 1,
    tables: [],
    specialRequests: '',
  });

  useEffect(() => {
    fetchReservations();
    fetchTables();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/reservations`);
      setReservations(res.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
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
      await axios.post(`${import.meta.env.VITE_API_URL}/reservations`, formData);
      fetchReservations();
      resetForm();
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/reservations/${reservationId}`, { status: newStatus });
      fetchReservations();
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const handleTableSelection = (tableId) => {
    setFormData(prev => ({
      ...prev,
      tables: prev.tables.includes(tableId)
        ? prev.tables.filter(id => id !== tableId)
        : [...prev.tables, tableId]
    }));
  };

  const resetForm = () => {
    setFormData({
      eventName: '',
      eventType: 'other',
      date: '',
      time: '',
      duration: 3,
      numberOfGuests: 1,
      tables: [],
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
        <h1 className="text-3xl font-bold">Event Reservations</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Reservation
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Event Reservation</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Event Name</label>
                <input
                  type="text"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="e.g., John's Birthday Party"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Event Type</label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="corporate">Corporate</option>
                  <option value="wedding">Wedding</option>
                  <option value="other">Other</option>
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
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 3 })}
                  className="w-full px-3 py-2 border rounded"
                  min="1"
                  max="12"
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
              <label className="block text-gray-700 mb-2">Select Tables</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tables.map(table => (
                  <label key={table._id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.tables.includes(table._id)}
                      onChange={() => handleTableSelection(table._id)}
                      className="mr-2"
                    />
                    Table {table.number} (Cap: {table.capacity})
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Special Requests</label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="3"
                placeholder="Any special requirements for the event..."
              />
            </div>

            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Create Reservation
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
        {reservations.map((reservation) => (
          <div key={reservation._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">
                  {reservation.eventName || `${reservation.eventType} Event`}
                </h3>
                <p className="text-gray-600">
                  {reservation.eventType} - {reservation.numberOfGuests} guests
                </p>
                <p className="text-gray-600">
                  {new Date(reservation.date).toLocaleDateString()} at {reservation.time}
                </p>
                <p className="text-gray-600">Duration: {reservation.duration} hours</p>
                <p className="text-gray-600">
                  Tables: {reservation.tables?.map(table => `T${table.number}`).join(', ') || 'None assigned'}
                </p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(reservation.status)}`}>
                  {reservation.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(reservation.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {reservation.specialRequests && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Special Requests:</h4>
                <p className="text-gray-700">{reservation.specialRequests}</p>
              </div>
            )}

            {(user?.role === 'restaurantadmin' || user?.role === 'staff') && (
              <div className="flex gap-2">
                {reservation.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(reservation._id, 'confirmed')}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Confirm
                  </button>
                )}
                {['pending', 'confirmed'].includes(reservation.status) && (
                  <button
                    onClick={() => handleStatusUpdate(reservation._id, 'cancelled')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Cancel
                  </button>
                )}
                {reservation.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(reservation._id, 'completed')}
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

export default Reservations;