var fs = require('fs');

var fees = JSON.parse(fs.readFileSync('./data/fees.json'));

var getFees = function(req, res) {

  if(!req || !req.body.length) {
    res.sendStatus(400);
  }

  var result = [];
  var orders = req.body;

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
          item['item_price'] = Math.round(itemPrice * 100) / 100;
        }
      });
    });
    result.push({
      order_id: order.order_number,
      order_date: order.order_date,
      order_price: Math.round(orderPrice * 100) / 100,
      order_items: order.order_items.map(function(item) {
        return item;
      })
    })
  });

  res.send(result);
}

var getDistributions = function(req, res) {

  if(!req || !req.body.length) {
    res.sendStatus(400);
  }

  var totalDistributions = [];
  var totalOtherAmount = 0.00;
  var orders = req.body;
  var result = {
    orders: [],
    totalDistributions: totalDistributions
  };

  orders.forEach(function(order) {

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
    amount: Math.round(totalOtherAmount * 100) / 100
  });

  res.send(result);
}

module.exports = {
  getFees: getFees,
  getDistributions: getDistributions
}