const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const auth = async (req,res,next) => {
    try {
        const token = req.session.user.token;
        const decoded = jwt.verify(token,'webproject');
        const user = await User.findOne({ _id: decoded._id, 'tokens.token':token}).lean();
        if(!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch(error) {
        res.status(403).redirect('/forbidden_access');
    }
}

module.exports = auth;