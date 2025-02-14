const Razorpay = require("razorpay");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports.createOrder = async (req, res) => {
    try {
        let { amount, currency } = req.body;
        amount = amount * 100; // Convert to paisa (for INR)

        const order = await razorpay.orders.create({
            amount,
            currency: currency || "INR",
            payment_capture: 1, // Auto-capture payment
        });

        res.json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create payment order" });
    }
};
