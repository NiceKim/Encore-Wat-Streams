require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const showRoutes = require('./routes/showRoutes');

const app = express();
app.use(bodyParser.json());

// Register Routes
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server Executing: http://localhost:${PORT}`));
