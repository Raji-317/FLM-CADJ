const mongoose = require('mongoose');
const User = require('./models/User');

async function fixPasswords() {
  await mongoose.connect('mongodb://127.0.0.1:27017/unisync');
  
  const users = await User.find({});
  for (const u of users) {
    if (!u.password || u.password === 'dhamini' || u.password === 'manisha' || u.password === 'srav' || u.password === '123456' || u.password === 'password' || u.password === 'teacher123') {
      u.password = u.role === 'admin' ? 'Admin@UniSync#2026' : 'Teach@UniSync#2026';
      await u.save();
      console.log('Fixed password for:', u.email, '->', u.password);
    }
  }

  console.log('Finished updating passwords.');
  await mongoose.disconnect();
}

fixPasswords().catch(console.error);
