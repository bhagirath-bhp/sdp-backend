const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Product = require("../models/product");
const Analyse = require("../models/analyse");
const DailyCount = require("../models/dailyCount");
const cookieToken = require("../utils/cookieToken");

router.post("/add", upload.single("image"), async (req, res) => {
    const timeNow = new Date();
    const today = timeNow.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });    console.log(req.body)
    try {
        // if (!req.file || req.userId || !req.body.pname || !req.body.price || !req.body.producer  || !req.body.quantity) {
        if (req.userId || !req.body.pname || !req.body.price || !req.body.producer  || !req.body.quantity) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const result = await cloudinary.uploader.upload(req.file.path);


        const product = new Product({
            userId: req.body.userId,
            pname: req.body.pname,
            price: req.body.price,
            producer: req.body.producer,
            quantity: req.body.quantity,
            lastUpdated: timeNow,
            imageURL: result.secure_url,
            cloudinary_id: result.public_id,
        });
        const productSuccess = await product.save();

        if (productSuccess) {
            const existingDailyCount = await DailyCount.findOne({ userId: product.userId });
      
            if (existingDailyCount) {
              const lastEntryDate = existingDailyCount.productsCountTimeline.slice(-1)[0];
      
              if (lastEntryDate === today) {
                await DailyCount.findOneAndUpdate(
                  { userId: product.userId },
                  { $inc: { "productsCount.$[lastElement]": 1 } },
                  { arrayFilters: [{ "lastElement": { $exists: true } }] }
                );
              } else {
                await DailyCount.findOneAndUpdate(
                  { userId: product.userId },
                  { $push: { productsCount: 1, productsCountTimeline: today } }
                );
              }
            } else {
              const newDailyCount = new DailyCount({
                userId: product.userId,
                productsCount: [1],
                productsCountTimeline: [today]
              });
              await newDailyCount.save();
            }
      
            res.status(200).send({
                success: true,
                userId: product.userId,
                pname: product.pname,
                producer: product.producer,
                price: product.price, 
                quantity: product.quantity,
                lastUpdated: product.lastUpdated,
                imageURL: product.imageURL,
            })
          }
        else{
            res.status(400).send({message: "Something went wrong"})
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/all/:userId", async (req, res) => {
    // const { pageNumber, pageSize } = req.body;
    const {userId} = req.params;
    try {
        if(!userId){
            res.send(401).send({message: "Unauthorized Access"})
        }
        let productFrame = await Product.find({userId: userId})
        // .skip((pageNumber - 1) * pageSize)
        // .limit(pageSize)
        productFrame = productFrame.map(obj => {
            const { _id, userId, pname, price, producer, lastUpdated, quantity, imageURL } = obj;
            return { id: _id, userId: userId, pname: pname, price: price, producer: producer, lastUpdated: lastUpdated, quantity: quantity, imageURL: imageURL };
        });

        if (productFrame) {
            res.status(200).send(productFrame);
        }
    } catch (error) {
        console.log(error)
    }
})


router.get("/search/:userId", async (req, res) => {
    try {
        const { userId } = req.params; 
        const { name } = req.query;
        const result = await Product.find({
            pname: { $regex: new RegExp(name, 'i') },
            // userId: userId
        });
        console.log(name)
        return res.status(200).json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error While Searching Products");
    }
})

router.delete("/delete/:productId", async (req, res) => {
    try {
        const { productId } = req.params; 
        const result = await Product.findOneAndDelete({ _id: productId });

        if (result) {
            return res.status(200).json({success: true, message: "Product deleted successfully" });
        } else {
            return res.status(400).json({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json("Server Error While Deleting Product");
    }
});
module.exports = router;