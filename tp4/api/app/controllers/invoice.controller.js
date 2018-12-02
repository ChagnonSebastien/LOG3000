var Invoice = require('../models/invoice.model.js');

exports.create = function(req, res) {
  if(!req.body.items) {
      return res.status(400).send({message: "Invoice can not be empty"});
  }

  var invoice = new Invoice({
    date: req.body.date,
    paid: req.body.paid,
    datePaid: req.body.datePaid,
    customer: req.body.customer,
    items: req.body.items,
  });

  invoice.save(function(err, data) {
      if(err) {
          console.log(err);
          res.status(500).send({message: "Some error occurred while creating the Invoice."});
      } else {
          res.send(data);
      }
  });
};

exports.findAll = function(req, res) {
  let filters = null;
  let sortCol = false;
  let limit = 10;
  let offset = 0;

  if (req.query.filters) {
    console.log(decodeURI(req.query.filters));
    filters = JSON.parse(decodeURI(req.query.filters));
  }

  if (req.query.sortCol && req.query.sortOrder) {
    sortCol = req.query.sortCol;
    if (req.query.sortOrder === 'DESC') {
      sortCol = `-${sortCol}`;
    }
  }

  if (req.query.limit && req.query.offset) {
    limit = req.query.limit;
    offset = req.query.offset;
  }

  Invoice
    .find(filters)
    .skip(parseInt(offset))
    .limit(parseInt(limit))
    .sort(sortCol)
    .exec(function(err, invoices){
      if(err) {
          console.log(err);
          res.status(500).send({message: "Some error occurred while retrieving invoices."});
      } else {
        Invoice.count(filters, (err, count) => {
          res.send({ invoices, count });
        });
      }
    });
};

exports.findOne = function(req, res) {
  Invoice.findById(req.params.invoiceId, function(err, invoice) {
      if(err) {
          console.log(err);
          if(err.kind === 'ObjectId') {
              return res.status(404).send({message: "Invoice not found with id " + req.params.invoiceId});
          }
          return res.status(500).send({message: "Error retrieving invoice with id " + req.params.invoiceId});
      }

      if(!invoice) {
          return res.status(404).send({message: "Invoice not found with id " + req.params.invoiceId});
      }

      res.send(invoice);
  });
};

exports.update = function(req, res) {
  Invoice.findById(req.params.invoiceId, function(err, invoice) {
      if(err) {
          console.log(err);
          if(err.kind === 'ObjectId') {
              return res.status(404).send({message: "Invoice not found with id " + req.params.invoiceId});
          }
          return res.status(500).send({message: "Error finding invoice with id " + req.params.invoiceId});
      }

      if(!invoice) {
          return res.status(404).send({message: "Invoice not found with id " + req.params.invoiceId});
      }

      invoice.date = req.body.date;
      invoice.paid = req.body.paid;
      invoice.datePaid = req.body.datePaid;
      invoice.customer = req.body.customer;
      invoice.items = req.body.items;

      invoice.save(function(err, data){
          if(err) {
              res.status(500).send({message: "Could not update invoice with id " + req.params.invoiceId});
          } else {
              res.send(data);
          }
      });
  });
};

exports.delete = function(req, res) {
  Invoice.findByIdAndRemove(req.params.invoiceId, function(err, invoice) {
      if(err) {
          console.log(err);
          if(err.kind === 'ObjectId') {
              return res.status(404).send({message: "Invoice not found with id " + req.params.invoiceId});
          }
          return res.status(500).send({message: "Could not delete invoice with id " + req.params.invoiceId});
      }

      if(!invoice) {
          return res.status(404).send({message: "Invoice not found with id " + req.params.invoiceId});
      }

      res.send({ _id: req.params.invoiceId, success: true })
  });
};
