require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const showRoutes = require('./routes/showRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();
app.use(bodyParser.json());


app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/theater', theaterRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server Executing: http://localhost:${PORT}`));
