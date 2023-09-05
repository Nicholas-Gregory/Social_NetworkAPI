const router = require('express').Router();
const Thought = require('../../models/Thought');
const User = require('../../models/User');

const { apiError } = require('../../utils');

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
        apiError(res, err);
    }
});

// Get all thoughts
router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find();
        res.status(200).json(thoughts);
    } catch (err) {
        apiError(res, err);
    }
});

// Get a single thought by ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const thought = await Thought.findOne({ _id: id });

        if (!thought) {
            res.status(404).send("No thought with that ID exists");
        }

        res.status(200).json(thought);
    } catch (err) {
        apiError(res, err);
    }
});

// Update a thought by ID
router.put('/:id', async (req, res) => {
    const body = req.body;
    const id = req.params.id;

    try {
        const thought = await Thought.findOne({ _id: id });

        if (!thought) {
            return res.status(404).send("No thought with that ID exists");
        }

        thought.thoughtText = body.thoughtText || thought.thoughtText;
        thought.username = body.username || thought.username;
        await thought.save();

        res.status(200).json(thought);
    } catch (err) {
        apiError(res, err);
    }
});

// Delete a thought by ID
router.delete('/:id', async (req, res) => {
    try {

    } catch (err) {
        apiError(res, err);
    }
});

module.exports = router;