const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.render('login.hbs');
  }

  jwt.verify(token, process.env.your_secret_key, (err, decoded) => {
    if (err) {
      return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
    }

    req.userId = decoded.userId;
    next();
  });
};


module.exports = verifyToken;