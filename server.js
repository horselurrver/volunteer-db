const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const models = require('./models/models');
const { Student, Form } = models;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', function () {
  console.log('Successfully connected to mongoose!');
});

mongoose.connection.on('error', function () {
  console.log('Mongoose connection error');
});

app.use(logger('dev'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
})


//register, login, submit form
app.post('/register', function(req, res) {
  const name = req.body.fullName;
  const password = req.body.password;
  Student.findOne({fullName: name}, function(err, student) {
    if (err) {
      res.json({success: false, error: err});
    } else if (!student) {
      const stud = new Student({
        fullName: name,
        password: password
      });
      stud.save();
      res.json({success: true});
    } else {
      res.json({success: false, error: 'Username taken'});
    }
  });
});

app.post('/login', function(req, res) {
  const fullName = req.body.fullName;
  const password = req.body.password;
  Student.findOne({fullName: fullName, password: password}, function(err, student) {
    if (err) {
      res.json({success: false, error: err});
    } else if (!student) {
      res.json({success: false});
    } else {
      res.json({success: true});
    }
  });
});

app.get('/students', function(req, res) {
  Student.find({}, function(err, students) {
    if (err) {
      res.json({success: false, error: err});
    } else {
      res.json({success: true, students: students});
    }
  });
});

app.post('/submitform', function(req, res) {
  const studentName = req.body.studentName;
  const location = req.body.location;
  const hours = req.body.hours;
  const organization = req.body.organization;
  const newForm = new Form({
    studentName: studentName,
    location: location,
    hours: hours,
    organization: organization
  });
  newForm.save(function(err, form) {
    if (err) {
      res.json({success: false, error: err});
    } else {
      Student.findOne({fullName: studentName}, function(err, student) {
        if (err) {
          res.json({success: false, error: err});
        } else {
          student.hours += parseInt(hours);
          student.organizations.push(organization);
          student.save();
          res.json({success: true});
        }
      });
    }
  });
});
