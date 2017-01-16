var express = require('express');
var bodyParser = require('body-parser');
var calc = require('./routes/calc');

var app = express();
app.use(bodyParser.json());

app.post('/order/fees', calc.getFees);

app.post('/order/distr', calc.getDistributions);

app.listen(3000, function() {
  console.log('Listening to port 3000');
});

module.exports = app;