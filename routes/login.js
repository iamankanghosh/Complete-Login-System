const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const verifyToken = require('../middleWare/verifyToken.js');
const getUserFromToken = require('../middleWare/getUserFromToken.js')
const sendMail = require('../middleWare/sendMail.js')


const User = require('../model.js');

router.get('/login', verifyToken, (req, res) => {

    if (req.userId) {
        return res.status(200).render('home', { alertMessage: 'already logged in' });
    }
    res.render('login.hbs');

});
router.get('/resetpassword', (req, res) => {
    res.render('resetpasswordform.hbs');
});

router.post('/reg', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const regUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        const token = jwt.sign({ userId: regUser._id }, process.env.your_secret_key, { expiresIn: '2d' });
        regUser.tokens.push({ token });
        await regUser.save();

        res.cookie('token', token, {
            httpOnly: true,
            secure: false
        });
        res.status(201).render('home.hbs');
    } catch (error) {
        return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.your_secret_key, { expiresIn: '2d' });
        user.tokens.push({ token });
        await user.save();
        res.cookie('token', token, {
            httpOnly: true,
            secure: false
        });
        res.status(200).render('home.hbs');
    } catch (error) {
        return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
});

router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.token;
        const user = await User.findOneAndUpdate(
            { 'tokens.token': token },
            { $pull: { tokens: { token: token } } },
            { new: true }
        )

        if (!user) {
            return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
        }
        res.clearCookie('token');
        res.status(200).render('home.hbs');
    } catch (error) {
        return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
})
router.post('/logout/all', async (req, res) => {
    try {
        const token = req.cookies.token;
        const user = await getUserFromToken(token);
        if (!user) {
            return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
        }
        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
        }
        user.tokens = [];
        await user.save();
        res.clearCookie('token');
        res.status(200).render('home.hbs');
    } catch (error) {
        return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
});

router.post('/updatePassword', async (req, res) => {
    try {
        const token = req.cookies.token;
        const user = await getUserFromToken(token);
        if (!user) {
            return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
        }
        const passwordMatch = await bcrypt.compare(req.body.oldpassword, user.password);
        if (!passwordMatch) {
            return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
        }
        const newPassword = req.body.newpassword;
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = newHashedPassword;
        user.tokens = [];
        await user.save();
        res.clearCookie('token');
        res.status(200).render('home.hbs');
    } catch (error) {
        return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
});
router.post('/resetpassword/userdata', async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if(!user){
            return res.render('home.hbs', { alertMessage: 'No user found' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.your_secret_key, { expiresIn: '10m' });
        const url = "http://localhost:3000/auth/resetpassword/" + token;
        console.log(url);
        await sendMail(url, email);
        res.render('home.hbs',{ alertMessage: 'Link sent to your email' });

    } catch (error) {
        return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
});
router.get('/resetpassword/:token', async (req, res) => {
    try {
        const token = req.params.token;
        res.cookie('token', token, {
            httpOnly: true,
            secure: false
        });
        res.render('passwordgeneration.hbs');
    } catch (error) {
        return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
});
router.post('/resetpassword/updatenew', async (req, res) => {
    try {
        const token = req.cookies.token;
        const newpassword = req.body.newpassword;
        const user = await getUserFromToken(token);
        if (!user) {
            return res.render('login.hbs', { alertMessage: 'No user found' });
        }
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newpassword, salt);
        user.password = newHashedPassword;
        user.tokens = [];
        await user.save();
        res.clearCookie('token');
        res.status(200).render('home.hbs');

    } catch (error) {
        return res.render('home.hbs', { alertMessage: 'Something went wrong , please retry' });
    }
});

module.exports = router;