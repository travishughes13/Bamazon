var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "Bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
});

// function which prompts the user for what action they should take
var start = function() {
    connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    else {
        console.log('ID || Name || Price')
        for (var i = 0; i < results.length; i++) {
            console.log('==========================');
            console.log(results[i].item_id + ' || ' + results[i].product_name + ' || $' + results[i].price);
            console.log('==========================');
        }
      inquirer.prompt({
        name: "customer",
        type: "rawlist",
        message: "Which items would you like to purchase?",
        choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      }).then(function(answer) {
        // based on their answer, either call the bid or the post functions
        if (answer.customer == '1' || '2' || '3' || '4' || '5' || '6' || '7' || '8' || '9' || '10') {
            var productID = answer.customer;
            var selectProducts = (answer.customer) - 1;
            connection.query("SELECT * FROM products", function(err, results){
                console.log('Great! ');
                console.log('==========================');
                console.log(results[selectProducts].item_id + ' || ' + results[selectProducts].product_name + ' || $' + results[selectProducts].price);
                console.log('==========================');
                var rightCost = results[selectProducts].price;
                var inStock = results[selectProducts].stock_qty;
                inquirer.prompt({
                    name: "item",
                    type: "rawlist",
                    message: "How many would you like to purchase?",
                    choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
                }).then(function(answer) {
                    var purchaseQty = answer.item;
                    console.log('OK then');
                        if (purchaseQty > inStock) {
                            console.log("I'm sorry, we cannot fulfill your order at this time");
                            start();
                        }
                        else {
                            var total = purchaseQty * rightCost;
                            var change = inStock - purchaseQty;
                            console.log("Your total comes out to $" + total);
                            connection.query("UPDATE products SET ? WHERE ?", [{
                                stock_qty: change
                                }, {
                                item_id: productID
                            }]);
                        }
                });
            });
      };
    });
};
    });
};

// function to handle posting new items up for auction

// run the start function when the file is loaded to prompt the user
start();