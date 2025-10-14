import * as eventService from "./event.service.js";

export const createEvent = async (req, res) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json(event);
    } catch (err) {
        console.error('Error creating event:', err.message);
        res.status(500).json({
            message: "Error creating event",
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const events = await eventService.getAllEvents();
        res.status(200).json(events);
    } catch (err) {
        console.error('Error fetching events:', err.message);
        res.status(500).json({ message: "Error fetching events" });
    }
};

export const getEventById = async (req, res) => {
    try {
        const event = await eventService.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (err) {
        console.error('Error fetching event:', err.message);
        res.status(500).json({ message: "Error fetching event" });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const event = await eventService.updateEvent(req.params.id, req.body);
        res.status(200).json(event);
    } catch (err) {
        console.error('Error updating event:', err.message);
        res.status(500).json({ message: "Error updating event" });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        await eventService.deleteEvent(req.params.id);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (err) {
        console.error('Error deleting event:', err.message);
        res.status(500).json({ message: "Error deleting event" });
    }
};