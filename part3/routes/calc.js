var fs = require('fs');

var fees = JSON.parse(fs.readFileSync('./data/fees.json'));
var orders = JSON.parse(fs.readFileSync('./data/orders.json'));

var getFees = function(req, res) {


  var result = [];

  orders.forEach(function(order) {
    var orderPrice = 0.00;

    order.order_items.forEach(function(item) {
      var itemPrice = 0.00;

      fees.forEach(function(feeCatType) {
        if(feeCatType.order_item_type === item.type){
          itemPrice += parseFloat(feeCatType.fees[0].amount);

          if(feeCatType.fees[1]) {
            itemPrice += parseFloat(feeCatType.fees[1].amount) * (item.pages - 1);
          }
          orderPrice += itemPrice;
          item['item_price'] = itemPrice.toFixed(2);
        }
      });
    });
    result.push({
      order_id: order.order_number,
      order_date: order.order_date,
      order_price: orderPrice.toFixed(2),
      order_items: order.order_items.map(function(item) {
        return item;
      })
    })
  });

  res.send(result);
}

var getDistributions = function(req, res) {

  var totalDistributions = [];
  var totalOtherAmount = 0.00;
  var result = {
    orders: [],
    totalDistributions: totalDistributions
  };

  orders.forEach(function(order) {
    console.log('Order ID:', order.order_number);

    var distributions = [];
    
    order.order_items.forEach(function(item) {
      fees.forEach(function(feeCatType) {
        if(feeCatType.order_item_type === item.type) {
          
          var price = feeCatType.fees[0].amount;
          
          feeCatType.distributions.forEach(function(distr) {
            var amount = parseFloat(distr.amount);
            price -= amount;

            var found = false;
            distributions.forEach(function(fund) {
              if(fund.name === distr.name) {
                fund.amount += amount;
                found = true;
              }
            });
            if(!found) {
              distributions.push({
                name: distr.name,
                amount: amount
              })
            }

            found = false;
            totalDistributions.forEach(function(fund) {
              if(fund.name === distr.name) {
                fund.amount = Math.round((fund.amount + amount) * 100) /100;
                console.log(fund.amount)
                found = true;
              }
            });
            if(!found) {
              totalDistributions.push({
                name: distr.name,
                amount: Math.round(amount * 100) / 100
              })
            }

          });
          if(price > 0) {
            distributions['Other'] = price;
            totalOtherAmount += price;
          }

        }
      })
    });

    result.orders.push({
      order_id: order.order_number,
      distributions: distributions
    });

  });

  totalDistributions.push({
    name: "Other",
    amount: totalOtherAmount.toFixed(2)
  });

  res.send(result);
}

module.exports = {
  getFees: getFees,
  getDistributions: getDistributions
}