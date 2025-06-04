const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Shows API
app.get('/api/shows', (req, res) => {
    // Temporary sample data
    const shows = [
        {
            id: 1,
            title: "Traditional Dance Performance",
            description: "Experience the beauty of traditional Cambodian dance",
            date: "2024-06-15",
            time: "19:00"
        },
        {
            id: 2,
            title: "Puppet Theater Show",
            description: "Classic puppet show featuring ancient stories",
            date: "2024-06-16",
            time: "20:00"
        }
    ];
    res.json(shows);
});

// Serve frontend for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 

// New comment