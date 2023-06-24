const express = require('express');
const router = express.Router();
const getUserFromToken = require('../middleWare/getUserFromToken.js')


router.get('/', (req, res) => {
    res.render('home.hbs');
});


router.get('/about', (req, res) => {
    res.render('about.hbs');
});
router.get('/profile', async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.render('login.hbs');
    }
    const user = await getUserFromToken(token);
    if (!user) {
        return res.render('login.hbs', { alertMessage: 'No user found' });
    }
    res.render('profile.hbs',{ "name": user.name, "email": user.email });

});



module.exports = router;