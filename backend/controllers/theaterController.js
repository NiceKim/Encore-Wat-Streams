const db = require('../../database/sample_db.js');

// Create a new show
const createShow = async (req, res) => {
  const admin_id = req.user.user_id;
  try {
    const { title, description, category, price} = req.body;
    
    // Check if all required fields are present
    if (!title || !description || !category) {
      return res.status(400).json({ 
        message: 'Required fields are missing. (title, description, and category are required)' 
      });
    }

    // Add new show to the database
    const newShow = await db.createShow(title, description, category, price, admin_id);

    res.status(201).json({ 
      message: 'The performance has been successfully created!',
      show: newShow 
    });

  } catch (err) {
    console.error('Error creating show:', err);
    res.status(500).json({ 
      message: 'An error occurred while creating the performance.',
      error: err.message 
    });
  }
};

// Create a new schedule
const createSchedule = async (req, res) => {
  const admin_id = req.user.user_id;
  try {
    const { show_id,date, location } = req.body;

    // Check if all required fields are present
    if (!show_id || !date || !location) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const newSchedule = await db.createSchedule(show_id, admin_id, date, location);

    res.status(201).json({
      message: 'The schedule has been successfully created!',
      schedule: newSchedule
    });
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ 
      message: 'An error occurred while creating the schedule.',
      error: err.message 
    });
  }
};

// Update a show
const updateShow = async (req, res) => {
  try {
    const showId = req.params.id;
    const { title, description, category, price} = req.body;
    const show = await db.getShowById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }
    // Authorization Check: Only the owner can update the show
    if (show.admin_id !== req.user.userId) {
      return res.status(403).json({ message: 'Only the owner can update the show.' });
    }
    const updatedShow = await db.updateShow({ showId, title, description, category, price, admin_id });
    res.json({ message: 'The performance has been successfully updated!', show: updatedShow });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while updating the performance.', error: err.message });
  }
};

// 공연 삭제
const deleteShow = async (req, res) => {
  try {
    const showId = req.params.id;
    const show = await db.getShowById(showId);
    if (!show) {
      return res.status(404).json({ message: 'Show not found.' });
    }

    if (req.user.type !== 'ADMIN') {
      return res.status(403).json({ message: 'Only the admin can delete the show.' });
    }

    // Authorization check: Only the owner can delete the show.
    if (show.admin_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Only the owner can delete the show.' });
    }
    await db.deleteShow(showId);
    res.json({ message: 'The performance has been successfully deleted!' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the performance.', error: err.message });
  }
};

// Update a shedule
const updateSchedule = async (req, res) => {
  const admin_id = req.user.user_id;
  const userType = req.user.type;
  try {
    if (userType !== 'ADMIN') {
      return res.status(403).json({ message: 'Only admin can update schedules.' });
    }
    const scheduleId = req.params.id;
    const { show_id, date, location } = req.body;
    const schedule = await db.getScheduleById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    if (schedule.Admin_ID !== admin_id) {
      return res.status(403).json({ message: 'Only the admin who created the schedule can update it.' });
    }
    const updatedSchedule = await db.updateSchedule({ scheduleId, show_id, admin_id, date, location });
    res.json({ message: 'Schedule has been successfully updated!', schedule: updatedSchedule });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while updating the schedule.', error: err.message });
  }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
  const admin_id = req.user.user_id;
  const userType = req.user.type;
  try {
    if (userType !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete schedules.' });
    }
    const scheduleId = req.params.id;
    const schedule = await db.getScheduleById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found.' });
    }
    if (schedule.Admin_ID !== admin_id) {
      return res.status(403).json({ message: 'Only the admin who created the schedule can delete it.' });
    }
    await db.deleteSchedule(scheduleId);
    res.json({ message: 'Schedule has been successfully deleted!' });
  } catch (err) {
    res.status(500).json({ message: 'An error occurred while deleting the schedule.', error: err.message });
  }
};

module.exports = { createShow, createSchedule, updateShow, deleteShow, updateSchedule, deleteSchedule }; 