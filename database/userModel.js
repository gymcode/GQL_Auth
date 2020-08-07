const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UseSchema = new Schema({
    phone: Number,
    username: String, 
    password: String, 
    email: String, 
    createAt: String  
});

module.exports = mongoose.model('users', UseSchema);