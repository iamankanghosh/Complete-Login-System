const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../model.js');

const getUserFromToken = async (token) => {

    try {
        const decoded = jwt.verify(token, process.env.your_secret_key);
        const userId = decoded.userId;
        const user = await User.findById(userId);

        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
};

module.exports = getUserFromToken;