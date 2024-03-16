const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Product = require("../models/product");
const cookieToken = require("../utils/cookieToken");

router.post("/product/add", upload.single("image"), async (req, res) => {
    console.log(req.body)
    try {
        if (!req.file || req.userId || !req.body.pname || !req.body.price || !req.body.producer  || !req.body.quantity) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const result = await cloudinary.uploader.upload(req.file.path);


        const product = new Product({
            userId: req.body.userId,
            pname: req.body.pname,
            price: req.body.price,
            producer: req.body.producer,
            quantity: req.body.quantity,
            lastUpdated: new Date(),
            imageURL: result.secure_url,
            cloudinary_id: result.public_id,
        });
        await product.save();

        if(product){
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


router.get("/product/all/:userId", async (req, res) => {
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


router.get("/product/search/:userId", async (req, res) => {
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
module.exports = router;