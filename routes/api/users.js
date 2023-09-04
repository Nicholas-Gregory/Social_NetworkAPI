const router = require('express').Router();
const User = require('../../models/User');

router.post('/', async (req, res) => {
    try {
        const user = await User.create({
            username: req.body.username,
            email: req.body.email
        });
        res.json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;