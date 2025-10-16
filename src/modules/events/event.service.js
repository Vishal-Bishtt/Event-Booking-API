import prisma from "../../config/prisma.js";

export const createEvent = async (eventData) => {
    return await prisma.event.create({
        data: {
            title: eventData.title,
            description: eventData.description,
            date: new Date(eventData.date),
            time: eventData.time,
            venue: eventData.venue,
            totalSeats: parseInt(eventData.totalseats),
            availableSeats: parseInt(eventData.availableSeats),
            price: parseFloat(eventData.price),
        }
    });
};

export const getAllEvents = async () => {
    return await prisma.event.findMany({ 
        orderBy: { date: "asc" } 
    });
};

export const getEventById = async (id) => {
    return await prisma.event.findUnique({ 
        where: { id } 
    });
};

export const updateEvent = async (id, data) => {
    return await prisma.event.update({ 
        where: { id }, 
        data 
    });
};

export const deleteEvent = async (id) => {
    return await prisma.event.delete({ 
        where: { id } 
    });
};