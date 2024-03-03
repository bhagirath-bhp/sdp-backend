const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");

router.post("/signup", upload.single("Image"), async (req, res) => {
    console.log(req.body)
    try {
        // Check if file is uploaded
        if (!req.file || !req.body.Name || !req.body.Email || !req.body.Password) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const existingUser = await User.findOne({ email: req.body.Email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists!" });
        }
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);


        const user = new User({
            name: req.body.Name,
            email: req.body.Email,
            password: req.body.Password,
            profileURL: result.secure_url,
            cloudinary_id: result.public_id,
        });
        await user.save();

        cookieToken(user,res)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/signin", async (req, res) => {
    console.log(req.body)
    try {
        if (!req.body.Email || !req.body.Password) {
            return res.status(400).json({ message: "Incomplete Data" });
        }
        const existingUser = await User.findOne({ email: req.body.Email });
        if (existingUser) {
            if(existingUser.password===req.body.Password){
                cookieToken(existingUser, res);
            }
            else{
                return res.status(400).json({ message: "Invalid Credentials!" });
            }
        }
        else{
            return res.status(400).json({ message: "User not found!" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        let user = await User.findbyId(req.param.id);
        if (!user)
            res.status(404)
                .send({
                    message: "User not found!"
                });
        res.status(200)
            .send(JSON(user));
    } catch (err) {
        console.log(err);
    }
});


router.delete("/:id", async (req, res) => {
    try {

        let user = await User.findById(req.params.id);

        await cloudinary.uploader.destroy(user.cloudinary_id);
        await user.remove();
        res.json(user);
    } catch (err) {
        console.log(err);
    }
});



router.put("/:id", upload.single("image"), async (req, res) => {
    try {
        let user = await User.findById(req.params.id);
        // Delete image from cloudinary
        await cloudinary.uploader.destroy(user.cloudinary_id);
        // Upload new image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);
        const data = {
            name: req.body.name || user.name,
            profile_img: result.secure_url || user.profile_img,
            cloudinary_id: result.public_id || user.cloudinary_id,
        };
        user = await User.findByIdAndUpdate(req.params.id, data, {
            new: true
        });
        res.json(user);
    } catch (err) {
        console.log(err);
    }
});


module.exports = router;