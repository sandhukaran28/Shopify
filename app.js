if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const productRouter = require('./routes/productRoutes');
const seedDB = require('./seebDB');
const methodOverride = require('method-override');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./models/user');
const authRouter = require('./routes/authRoute');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoute');

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})

// Using routers
app.use(productRouter);
app.use(authRouter);
app.use(cartRouter);
app.use(orderRouter);



app.get('/', (req, res) => {
    res.render('home');
});


// mongodb://localhost:27017/shopify-db
// process.env.MONGO_URL
// Connecting to database
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to database shopify-db');
        // seedDB();
    })
    .catch((err) => {
        console.log(err);
    })




app.listen(process.env.PORT || 3000, () => {
    console.log('Server Connected at port 3000');
})