const express = require('express');
const http = require('http');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const errorHandler = require('./middleware/errorHandler');
const { initSocket} = require('./utils/socket');
const cors = require('cors');


const app = express();
const server = http.createServer(app);


// Add this before your routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));



// Connect Database
connectDB();

// Init Socket.io
const io = initSocket(server);
app.set('io', io);

// Middleware
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
    res.send("hello world");
})

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/upload', uploadRoutes);

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`)
);