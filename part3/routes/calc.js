var fs = require('fs');


var getFees = function(req, res) {

  var fees = JSON.parse(fs.readFileSync('./data/fees.json'));
  var orders = JSON.parse(fs.readFileSync('./data/orders.json'));

  var result = [];

  orders.forEach(function(order) {
    // console.log('Order ID:', order.order_number);
    var orderPrice = 0.00;

    order.order_items.forEach(function(item) {
      var itemPrice = 0.00;

      fees.forEach(function(feeCatType) {
        if(feeCatType.order_item_type === item.type){
          itemPrice += parseFloat(feeCatType.fees[0].amount);

          if(feeCatType.fees[1]) {
            itemPrice += parseFloat(feeCatType.fees[1].amount) * (item.pages - 1);
          }
          // console.log('  Order Item -', item.type, ': $' + itemPrice);
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

module.exports = {
  getFees: getFees
}