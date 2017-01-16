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
        
        var price = feeCatType.fees[0].amount;
        
        feeCatType.distributions.forEach(function(distr) {
          var amount = parseFloat(distr.amount);
          price -= amount;
          distributions[distr.name] = amount;

          totalDistributions[distr.name] 
            ? totalDistributions[distr.name] = totalDistributions[distr.name] + amount
            : totalDistributions[distr.name] = amount

        });
        if(price > 0) {
          distributions['Other'] = price;

          totalDistributions['Other'] 
            ? totalDistributions['Other'] = totalDistributions['Other'] + price
            : totalDistributions['Other'] = price
        }

        console.log(distributions)
      }
    })
  })
});
console.log(totalDistributions);