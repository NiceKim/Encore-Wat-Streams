const db = require('./dbInterface');

// Get all bookings
const getBookings = (req, res) => {
    // req.user.User_ID
    // next();
    console.log(req.user.id)
    const bookings = db.getBookings(req.user.id);
    res.json(bookings);
  };
  
  // Create a new booking
  const createBooking = (req, res) => {
    const { Date, User_ID, Show_ID } = req.body;
    if (!Date || !User_ID || !Show_ID) {
      return res.status(400).json({ message: 'Field are missing.' });
    }
    const newBooking = db.createBooking({ Date, User_ID, Show_ID });
    res.status(201).json(newBooking);
  };
  
  // Delte a booking
  const deleteBooking = (req, res) => {
    const { id } = req.params;
    const result = db.deleteBooking(id);
    if (!result) {
      return res.status(404).json({ message: 'Booking not found.' });
    }
    res.json({ message: 'Booking deleted.' });
  };
  
  module.exports = { getBookings, createBooking, deleteBooking }; 