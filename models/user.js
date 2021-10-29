const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    category: {
        type: String,
        trim: true,
        required: true,
    },
    cart: [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            min: 0
        }
    }],
    orders: [{
        _id: false,
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        qty: {
            type: Number,
            min: 0
        },
        time: {
            type: Date,
        }
    }, ],
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;