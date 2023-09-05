const router = require('express').Router();
const User = require('../../models/User');
const { apiError } = require('../../utils');

// Create a user
router.post('/', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email
        });
        res.status(200).json(user);
    } catch (err) {
        apiError(res, err);
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        apiError(res, err);
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(404).send("No user with that ID exists");
        }

        res.json(user);
    } catch (err) {
        apiError(res, err);
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id });

        if (!user) {
            return res.status(404).send("No user with that ID exists");
        }

        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        apiError(res, err);
    }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.status(200).send("User successfully deleted");
    } catch (err) {
        apiError(res, err);
    }
});

// Add a friend to a user
router.post('/:userId/friends/:friendId', async (req, res) => {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    try {
        const user = await User.findOne({ _id: userId });
        const friend = await User.findOne({ _id: friendId });

        if (!user || !friend) {
            return res.status(404).send("No user with that ID exists");
        }

        user.friends.addToSet(friend._id);
        await user.save();
        res.status(200).json({
            user,
            friend
        });
    } catch (err) {
        apiError(res, err);
    }
});

// Remove a friend from a user
router.delete('/:userId/friends/:friendId', async (req, res) => {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    try {
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return res.status(404).send("No user with that ID exists");
        }

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        await user.save();

        res.status(200).send("Friend deleted");
    } catch (err) {
        apiError(res, err);
    }
});

module.exports = router;