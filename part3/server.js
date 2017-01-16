var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.post('/fees', function(req, res) {
  console.log(req.body);
  res.send(req.body);
});

app.listen(3000, function() {
  console.log('Listening to port 3000');
});