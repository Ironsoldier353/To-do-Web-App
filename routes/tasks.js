const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Add Task
router.post('/add', (req, res) => {
    const newTask = new Task({
        user: req.user.id,
        task: req.body.task
    });

    newTask.save()
        .then(task => {
            req.flash('success_msg', 'Task added');
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
});

// Delete Task
router.post('/delete/:id', (req, res) => {
    Task.deleteOne({ _id: req.params.id })
        .then(() => {
            req.flash('success_msg', 'Task deleted');
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
});

// Complete Task
router.post('/complete/:id', (req, res) => {
    Task.updateOne({ _id: req.params.id }, { completed: true })
        .then(() => {
            req.flash('success_msg', 'Task completed');
            res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
});

module.exports = router;
