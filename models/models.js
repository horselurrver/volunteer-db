const mongoose = require('mongoose');
var connect = process.env.MONGODB_URI;
var Schema = mongoose.Schema;

mongoose.connect(connect);

var studentSchema = new Schema({
  fullName: String,
  password: String,
  organizations: {
    type: Array,
    default: []
  },
  hours: {
    type: Number,
    default: 0
  }
});

var formSchema = new Schema({
  studentName: String,
  location: String,
  hours: Number,
  organization: String,
  startdate: Date,
  enddate: Date
});

var Student = mongoose.model('Student', studentSchema);
var Form = mongoose.model('Form', formSchema);

module.exports = {
  Student: Student,
  Form: Form
};
