const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.isLoggedIn = async(req,res,next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            res.status(401).json({error: "unauthorized access"});
            // return next(new Error("No token found"));
        }

        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        if(!decoded){
            res.status(401).json({error: "unauthorized access"});
        }
        next();

    } catch (error) {
        console.log(error);
    }
}