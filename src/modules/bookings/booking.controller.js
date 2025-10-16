import { BookingModal } from "./bookingModal.js";

export const BookingController={
    async createBooking(req,res){
        try{
            const{eventId,seatCount} = req.body;
            const userId = req.user.id;

            const stringEventId = String(eventId);

            const booking = await BookingModal.createWithTransaction(stringEventId, userId, seatCount);
            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                booking,
            });
        }catch(err){
            res.status(500).json({success: false, message: err.message})
        }
    },

    async confirmBooking(req,res){
        try{
            const {bookingId} = req.params;
            const booking = await BookingModal.confirm(bookingId);
            res.status(200).json({
                success: true,
                message: "Booking confirmed",
                booking,
            });
        }catch(err){
            res.status(500).json({success:true, message: err.message});
        }
    },

    async cancelBooking(req,res){
        try{
            const {bookingId} = req.params;
            const booking = await BookingModal.cancel(bookingId);

            res.json({
                success: true,
                message: "Booking cancelled",
                booking
            });
        }catch(err){
            res.status(500).json({success:true, message: err.message});
        }
    },

    async getAllBookings(req, res) {
        try {
            const bookings = await BookingModal.findAllWithDetails();
            res.json({ success: true, bookings });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getMyBookings(req, res) {
    try {
      const bookings = await BookingModal.findByUserId(req.user.id);

      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
    async getBookingById(req, res) {
    try {
      const { bookingId } = req.params;
      
      const booking = await BookingModal.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ 
          success: false, 
          message: "Booking not found" 
        });
      }

      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
