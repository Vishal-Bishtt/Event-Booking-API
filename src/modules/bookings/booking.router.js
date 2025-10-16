import express from "express";
import { BookingController } from "./booking.controller.js";
import {protect} from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post('/',BookingController.createBooking);
router.get('/my-bookings',BookingController.getBookingById);
router.get('/:bookingId',BookingController.getBookingById);
router.patch('/:bookingId/confirm',BookingController.confirmBooking);
router.patch('/:bookingId/cancel',BookingController.cancelBooking);

// Alternative HTTP methods can be used:
// router.put('/:bookingId/confirm', BookingController.confirmBooking);
// router.delete('/:bookingId', BookingController.cancelBooking);

//admin only
import { adminOnly } from "../../middlewares/adminMiddleware.js";
router.use(adminOnly);
router.get('/',BookingController.getAllBookings);

export default router;