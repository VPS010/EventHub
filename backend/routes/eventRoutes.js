const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const { createEvent, getEvents,getEventsByid, updateEvent, deleteEvent, joinEvent } = require('../controllers/eventController');

// Create Event without file upload middleware.
router.post('/', auth, createEvent);

// Get All Events.
router.get('/', auth, getEvents);

//Get Specific Event
router.get('/:id', auth, getEventsByid);


// Update Event.
router.put('/:id', auth, updateEvent);

// Delete Event.
router.delete('/:id', auth, deleteEvent);

// Join Event.
router.post('/join/:id', auth, joinEvent);

module.exports = router;
