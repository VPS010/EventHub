const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const authCheck = async (req, res) => {
    try {
        // Changed from findOne(req.user) to findById(req.user.id)
        const authUser = await User.findById(req.user.id);

        if (!authUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return sanitized user data (without password)
        const userData = {
            id: authUser._id,
            name: authUser.name,
            email: authUser.email,
            isGuest: authUser.isGuest
        };

        res.status(200).json(userData);

    } catch (error) {
        console.error('Auth check error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ name, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '72h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '72h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const guestLogin = async (req, res) => {
    try {
        // Generate random number between 1000 and 9999
        const randomNum = Math.floor(Math.random() * 9000) + 1000;

        // Create guest user with random number in name and email
        const guestUser = new User({
            name: `Guest${randomNum}`,
            email: `guest-${randomNum}-${Date.now()}@example.com`,
            isGuest: true
        });

        await guestUser.save();

        const payload = { user: { id: guestUser.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '6h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                        id: guestUser.id,
                        name: guestUser.name,
                        email: guestUser.email
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { registerUser, authCheck, loginUser, guestLogin };