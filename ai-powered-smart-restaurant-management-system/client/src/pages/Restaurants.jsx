import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Restaurants = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    cuisine: [],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    openingHours: {
      monday: { open: '', close: '' },
      tuesday: { open: '', close: '' },
      wednesday: { open: '', close: '' },
      thursday: { open: '', close: '' },
      friday: { open: '', close: '' },
      saturday: { open: '', close: '' },
      sunday: { open: '', close: '' },
    },
    isActive: true,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/restaurants`);
      setRestaurants(res.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRestaurant) {
        await axios.put(`${import.meta.env.VITE_API_URL}/restaurants/${editingRestaurant._id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/restaurants`, formData);
      }
      fetchRestaurants();
      resetForm();
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  };

  const handleEdit = (restaurant) => {
    setEditingRestaurant(restaurant);
    setFormData({
      name: restaurant.name,
      description: restaurant.description,
      phone: restaurant.phone,
      email: restaurant.email,
      cuisine: restaurant.cuisine || [],
      address: restaurant.address || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      openingHours: restaurant.openingHours || {
        monday: { open: '', close: '' },
        tuesday: { open: '', close: '' },
        wednesday: { open: '', close: '' },
        thursday: { open: '', close: '' },
        friday: { open: '', close: '' },
        saturday: { open: '', close: '' },
        sunday: { open: '', close: '' },
      },
      isActive: restaurant.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/restaurants/${id}`);
        fetchRestaurants();
      } catch (error) {
        console.error('Error deleting restaurant:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      phone: '',
      email: '',
      cuisine: [],
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
      openingHours: {
        monday: { open: '', close: '' },
        tuesday: { open: '', close: '' },
        wednesday: { open: '', close: '' },
        thursday: { open: '', close: '' },
        friday: { open: '', close: '' },
        saturday: { open: '', close: '' },
        sunday: { open: '', close: '' },
      },
      isActive: true,
    });
    setEditingRestaurant(null);
    setShowForm(false);
  };

  const handleCuisineChange = (e) => {
    const cuisine = e.target.value.split(',').map(c => c.trim()).filter(c => c);
    setFormData({ ...formData, cuisine });
  };

  const handleAddressChange = (field, value) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [field]: value },
    });
  };

  const handleHoursChange = (day, field, value) => {
    setFormData({
      ...formData,
      openingHours: {
        ...formData.openingHours,
        [day]: { ...formData.openingHours[day], [field]: value },
      },
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Restaurant Management</h1>
        {(user?.role === 'superadmin' || user?.role === 'restaurantadmin') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Restaurant
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingRestaurant ? 'Edit Restaurant' : 'Add Restaurant'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Cuisine (comma-separated)</label>
                <input
                  type="text"
                  value={formData.cuisine.join(', ')}
                  onChange={handleCuisineChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="3"
              />
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Street"
                  value={formData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.address.city}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.address.state}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={formData.address.zipCode}
                  onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={formData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4">
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
                {editingRestaurant ? 'Update' : 'Add'} Restaurant
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
        {restaurants.map((restaurant) => (
          <div key={restaurant._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{restaurant.name}</h3>
                <p className="text-gray-600">{restaurant.cuisine?.join(', ')}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${restaurant.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {restaurant.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {restaurant.description && (
              <p className="text-gray-700 mb-4">{restaurant.description}</p>
            )}
            <div className="text-sm text-gray-600 mb-4">
              <p>{restaurant.address?.street}, {restaurant.address?.city}</p>
              <p>{restaurant.phone}</p>
              <p>{restaurant.email}</p>
            </div>
            {(user?.role === 'superadmin' || (user?.role === 'restaurantadmin' && restaurant.owner._id === user._id)) && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(restaurant)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                {user?.role === 'superadmin' && (
                  <button
                    onClick={() => handleDelete(restaurant._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Delete
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

export default Restaurants;