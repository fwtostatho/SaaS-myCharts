const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { publishUserChangedEvent,publishUserCreatedEvent } = require('../choreographer/choreographer');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    try {
        const newUser = new User({
            username: req.body.username,
            userEmail: req.body.userEmail,
            numOfCharts: req.body.numOfCharts,
            lastLogin: req.body.lastLogin,
            currentLogin: req.body.currentLogin,
        });
        const savedUser = await newUser.save();
        await publishUserCreatedEvent(savedUser);
        res.json(savedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error(error);
    }
});

// GET a specific user by ID
router.get('/:userEmail', async (req, res) => {
    try {
        const user = await User.find({ userEmail: req.params.userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT (update) a specific user by ID
router.put('/', async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { userEmail: req.body.userEmail },
            { $set: { lastLogin: req.body.lastLogin , currentLogin:req.body.currentLogin } },
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        await publishUserChangedEvent(updatedUser);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE a specific user by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
