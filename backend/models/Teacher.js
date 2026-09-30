
const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
 name:String,
 email:String,
 department:String,
 role:String
});

module.exports = mongoose.model("Teacher", TeacherSchema);
