const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const productRouter = require('./routes/productRoutes');
const seedDB = require('./seebDB');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash');

app.use(express.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'ineedbettersecret',
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Using product router
app.use(productRouter);







// Connecting to database
mongoose.connect('mongodb://localhost:27017/shopify-db')
    .then(() => {
        console.log('Connected to database shopify-db');
        // seedDB();
    })
    .catch((err) => {
        console.log(err);
    })




app.listen(3000, () => {
    console.log('Server Connected at port 3000');
})