const express = require('express');
const router = express.Router();

// Dashboard Page
router.get('/dashboard', (req, res) => res.render('dashboard'));
// Root route
router.get('/', (req, res) => {
    res.render('index'); // Assuming you have a view named 'index.ejs'
});
module.exports = router;
