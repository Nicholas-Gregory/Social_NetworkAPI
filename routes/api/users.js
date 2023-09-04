const router = require('express').Router();
const User = require('../../models/User');

// Create a user
router.post('/', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email
        });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
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
        res.status(500).json(err);
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
        res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await User.deleteOne({ _id: req.params.id });
        res.status(200).send("User successfully deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;