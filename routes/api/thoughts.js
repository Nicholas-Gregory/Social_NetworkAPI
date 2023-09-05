const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');

// Create a thought
router.post('/', async (req, res) => {
    const body = req.body;

    try {
        const user = await User.findOne({ username: body.username });

        if (!user) {
            return res.status(404).send("No user with that username exists");
        }

        const thought = await Thought.create({
            thoughtText: body.thoughtText,
            createdAt: body.createdAt,
            username: body.username
        });
        
        user.thoughts.push(thought.id);
        await user.save();

        res.status(200).json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.status(200).json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;