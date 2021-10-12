const express = require('express');
const isLoggedIn = require('../middleware');
const Product = require('../models/product');
const User = require('../models/user');
const router = express.Router();

router.post('/cart/:productid/add', isLoggedIn, async (req, res) => {

    try {
        const {
            productid
        } = req.params;
        const product = await Product.findById(productid);

        const currentUser = req.user;

        currentUser.cart.push(product);

        await currentUser.save();

        req.flash('success', 'Item added to your cart successfully');
        res.redirect(`/products/${productid}`);
    } catch (e) {
        req.flash('error', 'Oops something went wrong');
    }

})


router.get('/user/cart', isLoggedIn, async (req, res) => {
    const userid = req.user._id;
    const user = await User.findById(userid).populate('cart');

    res.render('cart/userCart', {
        user
    });
})

module.exports = router;