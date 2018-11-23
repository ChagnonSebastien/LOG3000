module.exports = function(app) {

    var invoices = require('../controllers/invoice.controller.js');

    // Create a new invoice
    app.post('/invoices', invoices.create);

    // Retrieve all invoices
    app.get('/invoices', invoices.findAll);

    // Retrieve a single invoice with invoiceId
    app.get('/invoices/:invoiceId', invoices.findOne);

    // Update a invoice with invoiceId
    app.put('/invoices/:invoiceId', invoices.update);

    // Delete a invoice with invoiceId
    app.delete('/invoices/:invoiceId', invoices.delete);
}
