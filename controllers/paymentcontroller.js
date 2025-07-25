// controllers/razorpayController.js
const Razorpay = require("razorpay");

const instance = new Razorpay({
  key_id: "rzp_test_mcwl3oaRQerrOW", // Replace with your actual Razorpay Key ID
  key_secret: "N3hp4Pr3imA502zymNNyIYGI", // Replace with your actual Razorpay Secret
});

// Create Order Controller
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  createOrder,
};
