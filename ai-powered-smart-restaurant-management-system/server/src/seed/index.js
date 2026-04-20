const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const connectDB = require('../config/database');

require('dotenv').config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();
    await Order.deleteMany();
    await Booking.deleteMany();

    // Create users first
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@smartdine.ai',
      password: 'password123',
      role: 'superadmin',
    });

    // Create restaurants with superadmin as temporary owner
    const restaurant = await Restaurant.create({
      name: 'Urban Bites',
      address: {
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zipCode: '12345',
        country: 'Country',
      },
      phone: '123-456-7890',
      email: 'info@urbanbites.com',
      description: 'Modern restaurant with delicious food',
      owner: superAdmin._id,
    });

    // Now create restaurant admin with restaurant reference
    const restaurantAdmin = await User.create({
      name: 'Restaurant Admin',
      email: 'admin@urbanbites.com',
      password: 'password123',
      role: 'restaurantadmin',
      restaurant: restaurant._id,
    });

    // Update restaurant owner to restaurant admin
    await Restaurant.findByIdAndUpdate(restaurant._id, { owner: restaurantAdmin._id });

    // Create other users
    await User.create({
      name: 'Staff Member',
      email: 'staff@urbanbites.com',
      password: 'password123',
      role: 'staff',
      restaurant: restaurant._id,
    });

    await User.create({
      name: 'Guest User',
      email: 'guest@example.com',
      password: 'password123',
      role: 'guest',
    });

    // Create menu items
    await MenuItem.create([
      {
        name: 'Burger',
        description: 'Delicious beef burger',
        price: 12.99,
        category: 'Main Course',
        restaurant: restaurant._id,
        available: true,
      },
      {
        name: 'Pizza',
        description: 'Cheesy pizza',
        price: 15.99,
        category: 'Main Course',
        restaurant: restaurant._id,
        available: true,
      },
      {
        name: 'Salad',
        description: 'Fresh green salad',
        price: 8.99,
        category: 'Appetizer',
        restaurant: restaurant._id,
        available: true,
      },
    ]);

    // Create tables
    await Table.create([
      {
        number: 1,
        capacity: 4,
        restaurant: restaurant._id,
        status: 'available',
      },
      {
        number: 2,
        capacity: 2,
        restaurant: restaurant._id,
        status: 'available',
      },
    ]);

    // Get created data for references
    const guestUser = await User.findOne({ email: 'guest@example.com' });
    const menuItems = await MenuItem.find({ restaurant: restaurant._id });
    const tables = await Table.find({ restaurant: restaurant._id });

    // Create dummy orders
    await Order.create([
      {
        user: guestUser._id,
        restaurant: restaurant._id,
        items: [
          {
            menuItem: menuItems[0]._id, // Burger
            quantity: 2,
            price: menuItems[0].price,
          },
          {
            menuItem: menuItems[2]._id, // Salad
            quantity: 1,
            price: menuItems[2].price,
          },
        ],
        totalAmount: (menuItems[0].price * 2) + menuItems[2].price,
        status: 'delivered',
        orderType: 'dine-in',
        table: tables[0]._id,
      },
      {
        user: guestUser._id,
        restaurant: restaurant._id,
        items: [
          {
            menuItem: menuItems[1]._id, // Pizza
            quantity: 1,
            price: menuItems[1].price,
          },
        ],
        totalAmount: menuItems[1].price,
        status: 'pending',
        orderType: 'takeaway',
      },
    ]);

    // Create dummy bookings
    await Booking.create([
      {
        user: guestUser._id,
        restaurant: restaurant._id,
        table: tables[0]._id,
        numberOfGuests: 4,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        time: '19:00',
        status: 'confirmed',
      },
      {
        user: guestUser._id,
        restaurant: restaurant._id,
        table: tables[1]._id,
        numberOfGuests: 2,
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        time: '20:00',
        status: 'pending',
      },
    ]);

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();