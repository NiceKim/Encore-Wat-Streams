require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const showRoutes = require('./routes/showRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Register Routes
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server Executing: http://localhost:${PORT}`));