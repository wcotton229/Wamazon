var inquirer = require("inquirer");
var mysql = require('mysql');
var Table = require('cli-table');


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
    ]).then(function (answer) {
        var item = answer.item_id;
        // console.log(answer.item_id);

        var quantity = answer.quantity;
        // console.log(answer.quantity);



        var querySelect = 'SELECT * FROM products WHERE ?';

        connection.query(querySelect, { item_id: item }, function (err, data) {
            if (err) throw err;

            if (data.length === 0) {
                console.log('Invalid item ID. Please select a valid ID.');
                displayInventory();
            }
            else {
                var productData = data[0];

                if (quantity <= productData.stock_quantity) {
                    console.log('The product you requested is in stock! Placing your order!');

                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;

                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log('Your order has been placed! Your total is $' + productData.price * quantity);
                        console.log('\n-----------------------------\n');

                        newOrder();
                    })
                } else {
                    console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
                    console.log('Please change your order.');
                    console.log('\n-----------------------------\n');

                    promptUserPurchase();
                }

            };
        });
    });
}
function displayInventory() {

    queryStr = 'SELECT * FROM products';

    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('');
        console.log('========================ITEMS IN STORE=======================');

        // instantiate 
        var table = new Table({
            head: ['Item ID', 'Product Name', 'Department', 'Price'],
            style: {
                head: ['red'],
                compact: false,
                colAligns: ['center'],
            }
        });
        for (i = 0; i < data.length; i++) {
            table.push(
                [data[i].item_id, data[i].product_name, data[i].department_name, '$ ' + data[i].price]
            );

        }
        console.log(table.toString());
        promptUserPurchase();
    })
}

function newOrder() {
    inquirer.prompt([{
        type: 'confirm',
        name: 'choice',
        message: 'Would you like to place another order?'
    }]).then(function (answer) {
        if (answer.choice) {
            promptUserPurchase();
        }
        else {
            console.log('Thank you for shopping at Wamazon!');
            connection.end();
        }
    })
};

function runWamazon() {

    displayInventory();
}

runWamazon();