const db = require('./dbInterface');

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await db.getBookings();
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings.', error: err.message });
  }
};

// Create a new booking
const createBooking = (req, res) => {
  const { schedule_id } = req.body;
  const user_id = req.user.id || req.user.userId;
  const booking_date = new Date().toISOString().slice(0, 19).replace('T', ' '); 

  if (!show_id) {
    return res.status(400).json({ message: 'Field are missing.' });
  }

  db.createBooking({ booking_date, user_id, schedule_id })
    .then(newBooking => {
      res.status(201).json({
        message: "Booking created successfully.",
        booking: newBooking
      });
    })
    .catch(err => {
      res.status(500).json({ message: "Failed to create booking.", error: err.message });
    });
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