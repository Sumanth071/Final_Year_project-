import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'guest',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${import.meta.env.VITE_API_URL}/users/${editingUser._id}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/users`, formData);
      }
      fetchUsers();
      resetForm();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      isActive: user.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'guest',
      phone: '',
      isActive: true,
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'superadmin': return 'bg-red-100 text-red-800';
      case 'restaurantadmin': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      case 'guest': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        {(user?.role === 'superadmin' || user?.role === 'restaurantadmin') && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingUser ? 'Edit User' : 'Add User'}
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
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="guest">Guest</option>
                  <option value="staff">Staff</option>
                  <option value="restaurantadmin">Restaurant Admin</option>
                  {user?.role === 'superadmin' && <option value="superadmin">Super Admin</option>}
                </select>
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
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="mr-2"
                />
                Active User
              </label>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingUser ? 'Update' : 'Add'} User
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
        {users.map((user) => (
          <div key={user._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                {user.phone && <p className="text-gray-600">{user.phone}</p>}
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
                <p className={`text-sm mt-1 ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-500 mb-4">
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            {(user?.role === 'superadmin' || user?.role === 'restaurantadmin') && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
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

export default Users;