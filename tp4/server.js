var express = require('express');
var bodyParser = require('body-parser');

// create express app
var app = express();

var cors = require('cors');
app.use(cors());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// Configuring the database
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url);

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

app.use(function (req, res, next) {
  console.log('Accessing api');
  next();
})

app.get('/', (req, res) => {
  const str = 'Voici un exemple de facture:\
  {\
"date": "2018-03-17T20:39:00.485Z",\
"paid": true,\
"datePaid": "2018-03-17T20:39:00.485Z",\
"customer": "Karl",\
"items": [{\
"itemId": "1223",\
"description": "Test 4",\
"unitPrice": 13,\
"quantity": 4\
},{\
"itemId": "1233",\
"description": "Test 3",\
"unitPrice": 15,\
"quantity": 1\
}]\
}';
  res.send(str);
});


// Require Invoices routes
require('./app/routes/invoice.routes.js')(app);

// listen for requests
app.listen(3001, function(){
    console.log("Server is listening on port 3001");
});
