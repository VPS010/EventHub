const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Use memory storage for multer.
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
    }

    try {
        const formData = new FormData();
        // imgbb expects a base64 string.
        const base64Image = req.file.buffer.toString('base64');
        formData.append('image', base64Image);

        // Log URL and headers for debugging.
        const url = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`;
        console.log(`Uploading image to: ${url}`);
        console.log('Form Data Headers:', formData.getHeaders());

        const response = await axios.post(url, formData, { headers: formData.getHeaders() });

        res.json({ url: response.data.data.url });
    } catch (err) {
        console.error('Upload Error:', err.message);
        // For more detailed error info during debugging:
        if (err.response && err.response.data) {
            console.error('Response data:', err.response.data);
        }
        res.status(500).send('Server error');
    }
};

router.post('/', auth, upload.single('image'), uploadImage);

module.exports = router;
