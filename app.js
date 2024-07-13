const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');

const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const dbURI = 'mongodb://localhost:27017/todo-app';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// EJS View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true })); // Body parser
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); // Express session
app.use(passport.initialize()); // Passport middleware
app.use(passport.session());
app.use(flash()); // Connect flash for flash messages

// Global variables accessible in views
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null; // Make user available in all views
  next();
});

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/tasks', require('./routes/tasks'));


// Example route handler for '/dashboard'
app.get('/dashboard', async (req, res, next) => {
  try {
      // Retrieve tasks from your database or another source
      const tasks = await Task.find({ user: req.user._id }); // Assuming Mongoose Task model and req.user is authenticated

      res.render('dashboard', {
          user: req.user, // Pass req.user to the template if available
          tasks: tasks    // Pass tasks array to the template
      });
  } catch (err) {
      next(err); // Pass error to the next error handler
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`Something went wrong! Error: ${err.message}`);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
