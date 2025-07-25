const Razorpay = require('razorpay');

const instance = new Razorpay({ key_id: 'rzp_test_mcwl3oaRQerrOW', key_secret: 'N3hp4Pr3imA502zymNNyIYGI' });

module.exports.orders = (req, res) => {
    const TotalAmount = req.body.TotalAmount;  

    var options = {
        amount: TotalAmount * 100,  
        currency: "INR",
    };

    instance.orders.create(options, function (err, order) {
        if (err) {
            return res.send({ code: 500, message: "server error" })
        }
        return res.send({ code: 200, message: "order is created", data: order })
    });
};

module.exports.verify = () => {
   
    res.send({ verify });
};
