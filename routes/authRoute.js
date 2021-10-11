const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');


// router.get('/fakeUser', async (req, res) => {


//     const user = new User({
//         username: 'Karan',
//         email: 'sandhukaran2821@gmail.com'
//     });

//     const newUser = await User.register(user, 'karansingh28');

//     res.send('user added');

// })


router.get('/login', (req, res) => {

    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {

    const {
        username
    } = req.body;
    req.flash('success', `Welcome Back ${username} Again!!`);
    res.redirect('/products');

})

router.get('/logout', (req, res) => {
    req.logOut();

    req.flash('success', 'Logout out Successfully!!!');
    res.redirect('/login');
})



router.get('/signup', (req, res) => {

    res.render('auth/signup');
})


router.post('/register', async (req, res) => {

    const credentials = req.body;

    try {
        const user = new User({
            username: credentials.username,
            email: credentials.email
        });

        await User.register(user, credentials.password);

        req.flash('success', `Welcome ${credentials.username},Please login to continue!`);
        res.redirect('/products');
    } catch (e) {
        console.log(e);
    }

})


module.exports = router;