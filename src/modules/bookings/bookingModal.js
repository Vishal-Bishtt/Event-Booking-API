import prisma from "../../config/prisma.js";

export const BookingModal = {
    //creating new booking with transaction safety
    async createWithTransaction(eventId,userId,seatCount){
        return await prisma.$transaction(async(bk)=>{
            // Fetch event details
            const event = await bk.event.findUnique({
                where: { id: eventId },
            });
            // Check if event exists
            if (!event) throw new Error("Event not found");
            //CHECK SEAT AVAILABILITY
            if (event.availableSeats < seatCount) throw new Error("Not enough seats available");

            //calculate total amount
            const amount = event.price * seatCount;

            //update available seats in the event
            await bk.event.update({
                where: { id: eventId },
                data: {
                    availableSeats: {
                        decrement: seatCount
                    }
                }
            });

            //creating new booking
            const booking = await bk.booking.create({
                data:{
                    eventId,
                    userId,
                    seatCount,
                    amount,
                    status: "PENDING",
                },
            });

            return booking;
        });
    },

    //confirming the booking

    async confirm(bookingId){
        return await prisma.booking.update({
            where:{id:Number(bookingId)},
            data: {status:"CONFIRMED"},
        });
    },

    //cancel booking
    
    async cancel(bookingId){
        return await prisma.$transaction(async(bk)=>{
            //get booking details
            const booking = await bk.booking.findUnique({
                where: { id: Number(bookingId) },
            });

            if (!booking) throw new Error("Booking not found");
            if (booking.status === "CANCELLED") throw new Error("Booking already cancelled");

            //restore seats to the event
            await bk.event.update({
                where: { id: booking.eventId },
                data: {
                    availableSeats: {
                        increment: booking.seatCount
                    }
                }
            });

            //update booking status to cancelled
            return await bk.booking.update({
                where: { id: Number(bookingId) },
                data: { status: "CANCELLED" },
            });
        });
    },

    async findAllWithDetails(){
        return await prisma.booking.findMany({
            include:{event:true, user:true},
        });
    },

    async findByUserId(userId){
        return await prisma.booking.findMany({
            where:{userId},
            include:{event:true},
        });
    },

    //checking seat availablity

    async isSeatAvilable(eventId, seatNumber){
        const existing = await prisma.booking.findFirst({
            where:{
                eventId,
                status:{in: ["PENDING","CONFIRMED"]},
            },
        });
        return !existing;
    }
};