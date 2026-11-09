const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const studentRoutes = require('./routes/students');
const app = express();

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/students', studentRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));

app.use((err, req, res, next) => {
    if (err instanceof require('multer').MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File size exceeds the 5MB limit'
            });
        }

        return res.status(400).json({
            error: err.message
        });
    }

    if (err.message === 'Only image files are allowed') {
        return res.status(400).json({
            error: err.message
        });
    }

    console.error(err);

    res.status(500).json({
        error: 'Something went wrong'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});