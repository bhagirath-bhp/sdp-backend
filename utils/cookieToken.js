const jwt = require('jsonwebtoken')

const cookieToken = (user,res) => {
    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn: 24*60*60})

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_TIME * 24*60*60*1000
        ),
        httpOnly: true
    }

    return res.status(200).cookie('token',token,options).json({
        success: true,
        userId: user._id,
        token,
        name: user.name,
        email: user.email,
        profileURL: user.profileURL,
    })
}

module.exports = cookieToken