const router = require("express").Router();
const Order = require("../models/order");

router.post("/add", async (req, res) => {
  try {
    // const { bname, clientId, userId, productSet} = req.body;
    const { bname, products} = req.body;
    console.log(req.body)
    // if (!bname || !clientId || !userId || !productSet) {
    if (!bname || !products) {
      return res.status(400).json({ message: "Incomplete Data" });
    }
    
    // const order = new Order({
    //   oname: oname,
    //   clientId: clientId,
    //   userId: userId,
    //   productSet: productSet,
    // });
    const order = new Order({
      bname: bname,
      products: products,
    });

    await order.save(); // Save the order to the database

    return res.status(200).json({ message: "Order added successfully", success: true });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get("/all", async (req, res) => {
  try {
      let orderFrame = await Order.find({})
      // .skip((pageNumber - 1) * pageSize)
      // .limit(pageSize)

      if (orderFrame) {
          res.status(200).send(orderFrame);
      }
  } catch (error) {
      console.log(error)
  }
})

module.exports = router;