const mongoose = require('mongoose');
const User = require('./models/User');

async function fixRoles() {
  await mongoose.connect('mongodb://127.0.0.1:27017/unisync');
  console.log('Connected to MongoDB.');

  const users = await User.find({});
  let updatedCount = 0;

  for (const user of users) {
    let currentRole = (user.role || '').toLowerCase().trim();
    if (currentRole.includes('admin') || user.email === 'admin@edu.com') {
      currentRole = 'admin';
    } else {
      currentRole = 'teacher';
    }

    if (user.role !== currentRole) {
      console.log(`Fixing user ${user.email}: '${user.role}' -> '${currentRole}'`);
      user.role = currentRole;
      await user.save();
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} users.`);
  const allUsers = await User.find({}, 'email role name');
  console.log('Current user roles in DB:', allUsers);

  await mongoose.disconnect();
}

fixRoles().catch(console.error);
