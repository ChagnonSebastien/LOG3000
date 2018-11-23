var mongoose = require('mongoose');

var InvoiceSchema = mongoose.Schema({
    date: Date,
    paid: Boolean,
    datePaid: Date,
    customer: String,
    items: [mongoose.Schema.Types.Mixed]
}, {
    timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
