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
})

module.exports = router;