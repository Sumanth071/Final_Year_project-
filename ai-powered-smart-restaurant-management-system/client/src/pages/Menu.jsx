import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Menu = () => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    ingredients: [],
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    calories: '',
    preparationTime: '',
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/menu-items`);
      setMenuItems(res.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axios.put(`${import.meta.env.VITE_API_URL}/menu-items/${editingItem._id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/menu-items`, formData);
      }
      fetchMenuItems();
      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      ingredients: item.ingredients || [],
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      calories: item.calories,
      preparationTime: item.preparationTime,
      available: item.available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/menu-items/${id}`);
        fetchMenuItems();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      ingredients: [],
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      calories: '',
      preparationTime: '',
      available: true,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleIngredientChange = (e) => {
    const ingredients = e.target.value.split(',').map(i => i.trim()).filter(i => i);
    setFormData({ ...formData, ingredients });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menu Management</h1>
        {(user?.role === 'restaurantadmin' || user?.role === 'staff') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Menu Item
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
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
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preparation Time (minutes)</label>
                <input
                  type="number"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={formData.ingredients.join(', ')}
                  onChange={handleIngredientChange}
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
            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVegetarian}
                  onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                  className="mr-2"
                />
                Vegetarian
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isVegan}
                  onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                  className="mr-2"
                />
                Vegan
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isGlutenFree}
                  onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                  className="mr-2"
                />
                Gluten Free
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="mr-2"
                />
                Available
              </label>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingItem ? 'Update' : 'Add'} Item
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
        {menuItems.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{item.name}</h3>
                <p className="text-gray-600">{item.category}</p>
              </div>
              <span className="text-2xl font-bold text-green-600">${item.price}</span>
            </div>
            {item.description && (
              <p className="text-gray-700 mb-4">{item.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.isVegetarian && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Vegetarian</span>}
              {item.isVegan && <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Vegan</span>}
              {item.isGlutenFree && <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Gluten Free</span>}
              {!item.available && <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Unavailable</span>}
            </div>
            {(user?.role === 'restaurantadmin' || user?.role === 'staff') && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
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

export default Menu;