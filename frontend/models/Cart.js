const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    variant: {
        id: String,
        sku: String,
        size: String,
        color: String
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
});

const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [CartItemSchema],
    total: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'abandoned', 'completed'],
        default: 'active'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate total before saving
CartSchema.pre('save', function (next) {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    next();
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

module.exports = Cart;