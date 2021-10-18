const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review')
const isLoggedIn = require('../middleware');


// Getting all products
router.get('/products', async (req, res) => {

    try {
        const products = await Product.find({});


        res.render('./products/index', {
            products
        });
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/error');
    }


})

// GEtting page for adding product 
router.get('/products/new', (req, res) => {
    try {
        res.render('products/new');
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/error');
    }
})

// Adding product

router.post('/products', async (req, res) => {

    try {
        const newProduct = req.body;

        await Product.create(newProduct);

        req.flash('success', 'Product added Successfully');
        res.redirect('/products');
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/error');
    }

})




// Show a particular product
router.get('/products/:id', async (req, res) => {

    try {
        const {
            id
        } = req.params;

        const product = await Product.findById(id).populate('reviews');
        res.render('products/show', {
            product,
            message: req.flash('success')
        });
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/error');
    }

})


// Getting product for edit
router.get('/products/:id/edit', async (req, res) => {

    try {
        const {
            id
        } = req.params;

        const product = await Product.findById(id);

        res.render('products/edit', {
            product
        });
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/error');
    }

})

// Editing product

router.patch('/products/:id', async (req, res) => {

    try {
        const updatedProduct = req.body;
        console.log(updatedProduct);
        const {
            id
        } = req.params;

        await Product.findByIdAndUpdate(id, updatedProduct);

        req.flash('success', 'Product editd successfully');

        res.redirect(`/products/${id}`);
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/error');
    }


})





// Deleting product

router.delete('/products/:id', async (req, res) => {

    try {

        const {
            id
        } = req.params;

        await Product.findOneAndDelete(id);

        req.flash('success', 'product deleted successfully');

        res.redirect('/products');
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/error');
    }

})

// adding review

router.post('/products/:id/review', isLoggedIn, async (req, res) => {

    try {
        const {
            id
        } = req.params;

        const product = await Product.findById(id);
        const {
            rating,
            comment
        } = req.body;
        const newReview = new Review({
            rating,
            comment,
            user: req.user.username,
        });
        product.reviews.push(newReview);
        await product.save();
        await newReview.save();
        req.flash('success', 'review added succesfully');
        res.redirect(`/products/${id}`);
    } catch (e) {
        req.flash('error', 'oops,something went wrong');
        res.redirect('/products');
    }
})






module.exports = router;