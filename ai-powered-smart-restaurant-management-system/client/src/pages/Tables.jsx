import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Tables = () => {
  const { user } = useAuth();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    number: '',
    capacity: '',
    status: 'available',
    location: 'indoor',
    smokingAllowed: false,
    isActive: true,
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tables`);
      setTables(res.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTable) {
        await axios.put(`${import.meta.env.VITE_API_URL}/tables/${editingTable._id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/tables`, formData);
      }
      fetchTables();
      resetForm();
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setFormData({
      number: table.number,
      capacity: table.capacity,
      status: table.status,
      location: table.location,
      smokingAllowed: table.smokingAllowed,
      isActive: table.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/tables/${id}`);
        fetchTables();
      } catch (error) {
        console.error('Error deleting table:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      number: '',
      capacity: '',
      status: 'available',
      location: 'indoor',
      smokingAllowed: false,
      isActive: true,
    });
    setEditingTable(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Table Management</h1>
        {(user?.role === 'restaurantadmin' || user?.role === 'staff') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Table
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTable ? 'Edit Table' : 'Add Table'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Table Number</label>
                <input
                  type="number"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                  <option value="private">Private</option>
                  <option value="bar">Bar</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.smokingAllowed}
                  onChange={(e) => setFormData({ ...formData, smokingAllowed: e.target.checked })}
                  className="mr-2"
                />
                Smoking Allowed
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Active
              </label>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingTable ? 'Update' : 'Add'} Table
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Table {table.number}</h3>
                <p className="text-gray-600">Capacity: {table.capacity}</p>
                <p className="text-gray-600">Location: {table.location}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${getStatusColor(table.status)}`}>
                {table.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {table.smokingAllowed && <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm">Smoking</span>}
              {!table.isActive && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Inactive</span>}
            </div>
            {(user?.role === 'restaurantadmin' || user?.role === 'staff') && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(table)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(table._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;