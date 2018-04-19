var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');


var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'password',
	database: 'wamazon_db'
});

//Establish Connection - Call the Manager Input function
connection.connect(function(err){
	if (err) throw err;
	console.log('connected as id: ' + connection.threadId)
	managerInput();
});


//FUNCTIONS
//=============================================================

//Prompt the user for the action they would like to perform and then call the new transaction function
function managerInput(){
	inquirer.prompt([{
		type: 'list',
		name: 'input',
		message: 'What would you like to do today?',
		choices: ['1) View Products for sale', '2) View low inventory', '3) Add to inventory', '4) Add new product']
	}]).then(function(answer){
		if(answer.input === '1) View Products for sale'){
			connection.query('SELECT * FROM products', function(err, data){
			if (err) throw err;
			console.log('');
			console.log('========================ITEMS IN STORE=======================');
			for(i=0;i<data.length;i++){
             // instantiate 
            var table = new Table({
                head: ['Item ID', 'Product Name', 'Department', 'Price']
                , colWidths: [20, 40, 20, 20]
            });

            // table is an Array, so you can `push`, `unshift`, `splice` and friends 
            table.push(
                [data[i].item_id, data[i].product_name, data[i].department_name, '$ ' + data[i].price]
            );

            console.log(table.toString());
			}
			console.log('');
			newTransaction();
			})
		}
		else if(answer.input === '2) View low inventory'){
			connection.query('SELECT * FROM products WHERE stock_quantity < 5', function(err, res){
				if (err) throw err;
				console.log('')
				console.log('========================LOW INVENTORY=======================');
				for(i=0;i<res.length;i++){
                    console.log(`
     Name:  ${res[i].product_name}
     Prodcut ID: ${res[i].item_id}
     Quantity in stock: ${res[i].stock_quantity}
                    `);
					console.log('---------------------');
				}
				newTransaction();
			})
		}
		else if(answer.input === '3) Add to inventory'){
			inquirer.prompt([{
				name: 'item',
				message: 'Enter the ID of the item you wish to update:',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if(valid){
						return true
					}
						return 'Please enter a numerical value'
					}
			},{
				name: 'number',
				message: 'How many items would you like to add to the current supply?',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if(valid){
						return true
					}
						return 'Please enter a numerical value'
					}
			}]).then(function(answer){
				connection.query('SELECT * FROM products WHERE item_id = ?', [answer.item], function(err, res){
						connection.query('UPDATE products SET ? Where ?', [{
							stock_quantity: res[0].stock_quantity + parseInt(answer.number)
						},{
							item_id: answer.item
						}], function(err, res){});
				})
				console.log('Inventory updated');
				newTransaction();
			})
		}
		else if(answer.input === '4) Add new product'){
			inquirer.prompt([{
				name: 'product',
				message: 'Enter name of product:'
			},{
				name: 'department',
				message: 'Enter a department for this product'
			},{
				name: 'price',
				message: 'Enter a price for this product',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if(valid){
						return true
					}
						return 'Please enter a numerical value'
					}
			},{
				name: 'stock',
				message: 'Please enter a stock quantity for this product',
				validate: function(value){
					var valid = value.match(/^[0-9]+$/)
					if(valid){
						return true
					}
						return 'Please enter a numerical value'
					}
			}]).then(function(answer){
				connection.query('INSERT into products SET ?', {
					product_name: answer.product,
					department_name: answer.department,
					price: answer.price,
					stock_quantity: answer.stock
				}, function(err, res){});
				console.log('Product Added');
				newTransaction();
			})
		}
	})
};

//Prompt the user to see if they would like to perform another transaction or end the connection
function newTransaction(){
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to perform another transaction?'
	}]).then(function(answer){
		if(answer.choice){
			managerInput();
		}
		else{
			console.log('Have a good day');
			connection.end();
		}
	})
}