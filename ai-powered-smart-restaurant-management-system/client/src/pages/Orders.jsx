import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    table: '',
    items: [],
    orderType: 'dine-in',
    paymentMethod: 'cash',
    specialInstructions: '',
  });
  const [currentItem, setCurrentItem] = useState({
    menuItem: '',
    quantity: 1,
    specialInstructions: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
    fetchTables();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/menu-items`);
      setMenuItems(res.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
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
      const orderData = {
        ...formData,
        totalAmount: calculateTotal(),
      };
      await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData);
      fetchOrders();
      resetForm();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const addItemToOrder = () => {
    if (!currentItem.menuItem || currentItem.quantity < 1) return;

    const selectedMenuItem = menuItems.find(item => item._id === currentItem.menuItem);
    if (!selectedMenuItem) return;

    const newItem = {
      menuItem: selectedMenuItem._id,
      quantity: currentItem.quantity,
      price: selectedMenuItem.price,
      specialInstructions: currentItem.specialInstructions,
    };

    setFormData({
      ...formData,
      items: [...formData.items, newItem],
    });

    setCurrentItem({
      menuItem: '',
      quantity: 1,
      specialInstructions: '',
    });
  };

  const removeItemFromOrder = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const resetForm = () => {
    setFormData({
      table: '',
      items: [],
      orderType: 'dine-in',
      paymentMethod: 'cash',
      specialInstructions: '',
    });
    setCurrentItem({
      menuItem: '',
      quantity: 1,
      specialInstructions: '',
    });
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          New Order
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Order</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Order Type</label>
                <select
                  value={formData.orderType}
                  onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="dine-in">Dine-in</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="delivery">Delivery</option>
                </select>
              </div>
              {formData.orderType === 'dine-in' && (
                <div>
                  <label className="block text-gray-700 mb-2">Table</label>
                  <select
                    value={formData.table}
                    onChange={(e) => setFormData({ ...formData, table: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Table</option>
                    {tables.map(table => (
                      <option key={table._id} value={table._id}>Table {table.number}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="online">Online</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Add Items</h3>
              <div className="flex gap-2 mb-2">
                <select
                  value={currentItem.menuItem}
                  onChange={(e) => setCurrentItem({ ...currentItem, menuItem: e.target.value })}
                  className="flex-1 px-3 py-2 border rounded"
                >
                  <option value="">Select Menu Item</option>
                  {menuItems.map(item => (
                    <option key={item._id} value={item._id}>{item.name} - ${item.price}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Qty"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) || 1 })}
                  className="w-20 px-3 py-2 border rounded"
                  min="1"
                />
                <button
                  type="button"
                  onClick={addItemToOrder}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add
                </button>
              </div>
              <textarea
                placeholder="Special instructions for this item"
                value={currentItem.specialInstructions}
                onChange={(e) => setCurrentItem({ ...currentItem, specialInstructions: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="2"
              />
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              {formData.items.length === 0 ? (
                <p className="text-gray-500">No items added yet</p>
              ) : (
                <div className="space-y-2">
                  {formData.items.map((item, index) => {
                    const menuItem = menuItems.find(mi => mi._id === item.menuItem);
                    return (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div>
                          <span className="font-medium">{menuItem?.name}</span>
                          <span className="text-gray-600 ml-2">x{item.quantity}</span>
                          {item.specialInstructions && (
                            <p className="text-sm text-gray-500">{item.specialInstructions}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            type="button"
                            onClick={() => removeItemFromOrder(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div className="text-right font-bold text-lg">
                    Total: ${calculateTotal().toFixed(2)}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Special Instructions</label>
              <textarea
                value={formData.specialInstructions}
                onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                rows="3"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                disabled={formData.items.length === 0}
              >
                Create Order
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
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">Order #{order._id.slice(-6)}</h3>
                <p className="text-gray-600">{order.orderType} - {order.paymentMethod}</p>
                <p className="text-gray-600">Total: ${order.totalAmount}</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              <div className="space-y-1">
                {order.items.map((item, index) => {
                  const menuItem = menuItems.find(mi => mi._id === item.menuItem);
                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{menuItem?.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {(user?.role === 'restaurantadmin' || user?.role === 'staff') && (
              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'confirmed')}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                  >
                    Confirm
                  </button>
                )}
                {order.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'preparing')}
                    className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 text-sm"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'ready')}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === 'ready' && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'delivered')}
                    className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 text-sm"
                  >
                    Mark Delivered
                  </button>
                )}
                {['pending', 'confirmed', 'preparing'].includes(order.status) && (
                  <button
                    onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Cancel
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

export default Orders;