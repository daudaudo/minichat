require('dotenv').config();

const mongoose = require('mongoose');
const User = require('../app/models/User');
const Role = require('../app/models/Role');
const bcrypt = require('bcrypt');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'minichat',
})

const password = "minichat";

async function createAdmin() {
    var user = new User();
    user.username = "admin";
    user.email = "admin@minichat.fun";
    user.password = bcrypt.hashSync(password, 10);
    user.role = Role.ADMIN_ROLES;

    await user.save();
    return user;
}

createAdmin().then((user) => {
    console.log('Create admin user success fully \n');
    console.log(`Admin Email: ${user.email}`);
    console.log(`Admin Password: ${password}`);
    process.exit();
});
