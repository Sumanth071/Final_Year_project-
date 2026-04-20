const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Table = require('../models/Table');
const connectDB = require('../config/database');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Table.deleteMany();

    // Create restaurants
    const restaurant = await Restaurant.create({
      name: 'Urban Bites',
      address: '123 Main St, City',
      phone: '123-456-7890',
      email: 'info@urbanbites.com',
      description: 'Modern restaurant with delicious food',
    });

    // Create users
    await User.create({
      name: 'Super Admin',
      email: 'superadmin@smartdine.ai',
      password: 'password123',
      role: 'superadmin',
    });

    await User.create({
      name: 'Restaurant Admin',
      email: 'admin@urbanbites.com',
      password: 'password123',
      role: 'restaurantadmin',
      restaurant: restaurant._id,
    });

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

    console.log('Data seeded successfully');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();