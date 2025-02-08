const Event = require('../models/Event');
const User = require('../models/User')

const createEvent = async (req, res) => {
    // Destructure image along with other fields from req.body.
    const { title, description, date, location, category, image } = req.body;

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            category,
            image, // Will be undefined if no image URL is provided.
            organizer: req.user.id,
            attendees: [req.user.id]
        });

        const event = await newEvent.save();

        // Retrieve the Socket.io instance from the app and emit the event.
        const io = req.app.get('io');
        io.emit('event_created', event);

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


const getEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', ['name'])
            .populate('attendees', ['name'])
            .sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getEventsByid = async (req, res) => {
    const id = req.params.id;
    try {
        const event = await Event.findById(id)
            .populate('organizer', ['name'])
            .populate('attendees', ['name']);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }
        console.log(event);
        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event not found' });
        }
        res.status(500).send('Server error');
    }
};

const updateEvent = async (req, res) => {
    const { title, description, date, location, category, image } = req.body;

    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Check ownership.
        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: { title, description, date, location, category, image } },
            { new: true }
        );

        // Emit real-time update.
        const io = req.app.get('io');
        io.emit('event_updated', event);

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        if (event.organizer.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await event.deleteOne();

        // Emit real-time update.
        const io = req.app.get('io');
        io.emit('event_deleted', { id: req.params.id });

        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


const joinEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        const userId = req.user.id;
        const attendeeIndex = event.attendees.findIndex(attendee =>
            attendee.toString() === userId
        );

        let action;
        if (attendeeIndex === -1) {
            event.attendees.push(userId);
            action = 'joined';
        } else {
            event.attendees.splice(attendeeIndex, 1);
            action = 'left';
        }
        await event.save();

        const user = await User.findById(userId).select('name email');
        const io = req.app.get('io');

        if (action === 'joined') {
            io.emit('attendee_joined', {
                eventId: event._id,
                user: { _id: user._id, name: user.name }
            });
        } else {
            io.emit('attendee_left', {
                eventId: event._id,
                userId: user._id
            });
        }

        res.json(event.attendees);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = { createEvent, getEvents, getEventsByid, updateEvent, deleteEvent, joinEvent };
