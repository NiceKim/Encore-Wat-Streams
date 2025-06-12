require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const showRoutes = require('./routes/showRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();  
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/theater', theaterRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../frontend/404.html'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server Executing: http://localhost:${PORT}`));