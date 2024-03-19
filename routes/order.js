const router = require("express").Router();
const Order = require("../models/order");
const Analyse = require("../models/analyse");
const DailyCount = require("../models/dailyCount");


router.post("/add", async (req, res) => {
  const timeNow = new Date();
  const today = new Date().toLocaleDateString();
  try {
    // const { bname, clientId, userId, productSet} = req.body;
    const { bname, products, userId, totalAmount } = req.body;
    // if (!bname || !clientId || !userId || !productSet) {
    if (!userId || !bname || !products || !totalAmount) {
      return res.status(400).json({ message: "Incomplete Data" });
    }

    // const order = new Order({
    //   oname: oname,
    //   clientId: clientId,
    //   userId: userId,
    //   productSet: productSet,
    // }); 

    products.forEach((product) => {
      console.log(product)
    })

    const order = new Order({
      bname: bname,
      userId: userId,
      products: products,
      totalAmount: totalAmount
    });

    const orderSuccess = await order.save();

    if (orderSuccess) {
      await Analyse.findOneAndUpdate(
        { userId: order.userId },
        {
          $push: {
            orders: { orderId: order._id, slug: order.bname, amount: order.totalAmount },
            ordersTimeline: timeNow
          }
        },
        { upsert: true }
      );
      return res.status(200).json({ message: "Order added successfully", success: true });
    }


  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/all/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    let orderFrame = await Order.find({ userId: userId })
    // .skip((pageNumber - 1) * pageSize)
    // .limit(pageSize)

    if (orderFrame.length > 0) {
      res.status(200).json(orderFrame);
    } else {
      res.status(404).json({ message: "No orders found for the given userId" });
    }
  } catch (error) {
    console.log(error)
  }
})

module.exports = router;