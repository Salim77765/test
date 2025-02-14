const express = require("express");
const Razorpay = require("razorpay");
require("dotenv").config();

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Route to create a Razorpay order
router.post("/create-order", async (req, res) => {
    try {
        const { amount } = req.body;
        const order = await razorpay.orders.create({
            amount: amount * 100,
            currency: "INR",
            payment_capture: 1,
        });

        res.json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Failed to create payment order" });
    }
});

// Route to handle successful payments (optional)
router.get("/success", (req, res) => {
    res.send("Payment Successful! Thank you for your purchase.");
});

module.exports = router;
