const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../middleWare/passport.js');
const User = require('../model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleWare/verifyToken.js');

router.get('/', (req, res) => {
    res.render('home');
});
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
}

router.get('/auth/google',
    passport.authenticate('google', {
        scope:
            ['email', 'profile']
    }
    ));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/authGoogle/auth/google/success',
        failureRedirect: '/authGoogle/auth/google/failure'
    }));


router.get('/auth/google/success',isLoggedIn, async (req, res) => {
    try {
        let name = req.user.displayName;
        let email = req.user.email;
        if (!req.user.displayName || !req.user.email) {
            return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
        }

        
        const user = await User.findOne({ email: email });
        if (user) {
            const token = jwt.sign({ userId: user._id }, process.env.your_secret_key, { expiresIn: '2d' });
            user.tokens.push({ token });
            await user.save();
            res.cookie('token', token, {
                httpOnly: true,
                secure: false
            });
            return res.status(200).render('home.hbs');
        }
        
        function generateRandomPassword(length) {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=';
            let password = '';

            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }

            return password;
        }
        const password = generateRandomPassword(8);

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
        res.status(200).render('home.hbs');
    } catch (error) {
        return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
    }


})

router.get('/auth/google/failure', (req, res) => {
    return res.render('login.hbs', { alertMessage: 'Something went wrong , please retry' });
})


module.exports = router;








