var inquirer = require("inquirer");
var mysql = require('mysql');


var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    //Username
    user: 'root',

    //Password
    password: 'password',
    database: 'wamazon_db'

});

// Function that checks if the user is inputting a positive integers for their inputs
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true;
    }
    else {
        return "Please enter whole non-zero number.";
    }
}

// Fucntion prompts user to select item and quantity
function promptUserPurchase() {
    // console.log('User Purchase');

    // Prompt for user to select items

    inquirer.prompt([
        {
            type: 'input',
            name: 'item_id',
            message: 'Enter the Item ID for which you would like to purchase.',
            validate: validateInput,
            filter: Number
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you need?',
            validate: validateInput,
            filter: Number
        }
    ]).then(function (input) {
        var item = input.id;
        var quantity = input.quantity;


        var querySelect = 'SELECT * FROM producats WHERE?';

        connection.query(querySelect, { id: id }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('Invalid item ID. Please select a valid ID');
                displayInventory();
            }
            else {
                var productData = data[0];

                if (quantity <= productData.stock_quantity) {
                    console.log('The product you requested is in stock! Placing your order!');

                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + 'WHERE id = ' + item;

                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productData.price * quantity);
                        console.log('Thank you for shopping with us!');
                        console.log('\n-----------------------------\n');

                        // connection.end();
                    })
                } else {
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
                    console.log('Please change your order.');
                    console.log('\n-----------------------------\n');

                    displayInventory();
                }
            };
        });
    });
}
function displayInventory() {

    queryStr = 'SELECT * FROM products';

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Existing Inventory: ');
        console.log('..............\n');

        var strOut = '';
        for (var i = 0; i < data.length; i++) {
            strOut = '';
            strOut += 'Item ID: ' + data[i].id + ' // ';
            strOut += 'Product Name: ' = data[i].product_name + ' // ';
            strOut += 'Department: ' + data[i].department_name + ' // ';
            strOut += 'Price: $' + data[i].price + '\n';

            console.log(strOut);
        }

            console.log("-----------------------------------------\n");
            promptUserPurchase();
    })
}

function runWamazon() {

    displayInventory();
}

runWamazon();