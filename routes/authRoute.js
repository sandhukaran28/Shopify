const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const sendEmail = require('../sendGrid');




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


router.post('/placeorder', async (req, res) => {

    const email = req.user.email;
    console.log('email:' + email);

    const template = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    
        <style>
            *{
                padding: 0;
                margin: 0;
            }
            .mainDiv{
                background: #444691;
                width: 450px;
                height: 400px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .inner{
                width: 350px;
                height: 300px; 
                background-color: white !important;
                margin:40px auto  
            }
            .header h1{
                text-align: center;
            }
            .header{
                background: #a8dadc;
                padding: 10px;
                color: white;
            }
            p{
                padding: 10px;
                font-size: 1.1rem;
            }
        </style>
    </head>
    <body>
    
            <div class="mainDiv">
                <div class="inner">
                    <div class="header">
                        <h1>ORDER PLACED</h1>
                    </div>
                    <div>
                    <p>
                        Hi ${req.user.username},<br><br>
    
                    Confirmation of order has placed. <br><br><br>
                    Thanks! <br>
                    Team Shopify
                    </p>
                    </div>
                </div>
        </div>
        
    </body>
    </html>`;

    const currentUser = req.user;
    await currentUser.orders.push({
        products: currentUser.cart
    })
    await currentUser.save();

    const userid = req.user._id;

    await User.findByIdAndUpdate(userid, {
        $pull: {
            "cart": {}
        }
    });


    sendEmail(email, template, ` Hi ${req.user.username},Confirmation of order has placed. Thanks!  Team Shopify`);
    req.flash('success', 'Order Placed Successfully!!!');
    res.redirect('/products');
})



router.get('/signup', (req, res) => {

    res.render('auth/signup');
})


router.post('/register', async (req, res) => {

    const credentials = req.body;
    console.log(req.body);

    try {
        const user = new User({
            username: credentials.username,
            email: credentials.email,
            category: credentials.category
        });

        await User.register(user, credentials.password);

        req.flash('success', `Welcome ${credentials.username},Please login to continue!`);
        res.redirect('/products');
    } catch (e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/signup');
    }

})


module.exports = router;