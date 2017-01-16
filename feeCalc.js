var fs = require('fs');


var fees = JSON.parse(fs.readFileSync('fees.json'));
var orders = JSON.parse(fs.readFileSync('orders.json'));

// console.log(fees);
// console.log(orders);

orders.forEach(function(order) {
  console.log('Order ID: ', order.order_number);
  var orderPrice = 0.00;

  order.order_items.forEach(function(item) {
    var itemPrice = 0.00;

    fees.forEach(function(feeCatType) {
      if(feeCatType.order_item_type === item.type){
        itemPrice += parseFloat(feeCatType.fees[0].amount);

        if(feeCatType.fees[1]) {
          itemPrice += parseFloat(feeCatType.fees[1].amount) * (item.pages - 1);
        }
        console.log('  Order Item -', item.type, ': $' + itemPrice);
        orderPrice += itemPrice;
      }
    })
  })
  console.log('  Order Total: $' + orderPrice);
});