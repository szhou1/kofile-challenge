var fs = require('fs');

var fees = JSON.parse(fs.readFileSync('fees.json'));
var orders = JSON.parse(fs.readFileSync('orders.json'));

var totalDistributions = [];

orders.forEach(function(order) {
  console.log('Order ID: ', order.order_number);

  var distributions = [];
  
  order.order_items.forEach(function(item) {
    fees.forEach(function(feeCatType) {
      if(feeCatType.order_item_type === item.type) {
        
        console.log(feeCatType.fees[0].amount);
        var price = feeCatType.fees[0].amount;
        
        feeCatType.distributions.forEach(function(distr) {
          var amount = parseFloat(distr.amount);
          price -= amount;
          distributions[distr.name] = amount;

          if(totalDistributions[distr.name]) {
            totalDistributions[distr.name] = totalDistributions[distr.name] + amount;
          } else {
            totalDistributions[distr.name] = amount;
          }
        });

        console.log(distributions)
      }
    })
  })
});
console.log(totalDistributions);