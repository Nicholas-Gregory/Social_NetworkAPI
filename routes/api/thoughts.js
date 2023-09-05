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
        await Thought.deleteOne({ _id: req.params.id });
        res.status(200).send("Thought deleted successfully");
    } catch (err) {
        apiError(res, err);
    }
});

// Add a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
    const id = req.params.thoughtId;
    const body = req.body;
    
    try {
        const thought = await Thought.findOne({ _id: id });

        if (!thought) {
            return res.status(404).send("No thought with that ID exists");
        }

        const newReactionData = {
            reactionBody: body.reactionBody,
            username: body.username
        }
        if (thought.reactions) {
            thought.reactions.push(newReactionData);
        } else {
            thought.reactions = [newReactionData]
        }
        await thought.save();

        res.status(200).json(thought);
    } catch (err) {
        apiError(res, err);
    }
});

// Delete a reaction by reactionId
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    const thoughtId = req.params.thoughtId;
    const reactionId = req.params.reactionId;

    try {
        const thought = await Thought.findOne({ _id: thoughtId });
        let reaction;

        if (!thought) {
            return res.status(404).send("No thought with that ID exists");
        }

        if (thought.reactions) {
            reaction = thought.reactions
            .filter(reaction => reaction.reactionId.toString() === reactionId);
            console.log(reaction);
        }
        if (reaction.length > 0) {
            reaction[0].deleteOne();
            await thought.save();

            res.status(200).send("Reaction successfully deleted");
        } else {
            res.status(404).send("No reaction with that ID exists");
        }     
    } catch (err) {
        apiError(res, err);
    }
});

module.exports = router;