CREATE DATABASE wamazon_db;

USE wamazon_db;

CREATE TABLE products(
id INTEGER (11) AUTO_INCREMENT NOT NULL,
product_name VARCHAR (30) NOT NULL,
deparment_name VARCHAR (30) NOT NULL,
price DECIMAL (10,2) NOT NULL,
stock_quantity INTEGER (10) NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO products (product_name, deparment_name, price, stock_quantity)
VALUES ('Old Spice Body Wash Swagger 32oz', 'Home', 7.79, 75)
, ('Old Spice Dedorant Classic (6 Pack)', 'Home', 19.74, 185)
, ('Head & Shoulders Shampoo Classic (2 Pack)', 'Home', 15.64, 115)
, ('Filtrete AC Air Filter (6 Pack)', 'Home', 33.39, 65)
, ('Windex Class Cleaner 23 fl oz', 'Home', 3.09, 200)
, ('Digital Food Scale', 'Kitchen', 11.99, 45)
, ('Instant Cooking Pot', 'Kitchen', 99.95, 25)
, ('Air-Tight Food Storage Container, 5pc. set', 'Kitchen', 39.95, 60)
, ('Brita Replacement Filters, 3pc', 'Kitchen', 14.00, 250)
, ('Digital Meat Thermometer', 'Kitchen', 8.99, 70)
, ('Wagners Wild Bird Seed 40lbs', 'Outdoors', 25.50, 50)
, ('Digging Shovel', 'Outdoors', 21.75, 30)
, ('BBQ Grill Tool Set (16pc)', 'Outdoors', 25.49, 80)
, ('1-Gallon Lawn and Garden Sprayer', 'Outdoors', 10.32, 90)
, ('3X5 Foot American Flag', 'Outdoors', 5.95, 300)
, ('Bottle Brush', 'Baby', 5.00, 120)
, ('Stack Up Cups', 'Baby', 3.99, 95)
, ('Baby Monitor', 'Baby', 165.99, 50)
, ('Outlet Plugs 20 Pack', 'Baby', 7.87, 275)
, ('Nasal Aspirator', 'Baby', 19.99, 85)
, ('Play-doh (10 Pack)', 'Games and Toys', 7.99, 375)
, ('Connect 4', 'Games and Toys', 8.79, 35)
, ('Jenga', 'Games and Toys', 10.27, 50)
, ('Strong Arm Blaster Nerf Gun', 'Games and Toys', 12.99, 65)
, ('Cards Against Humanity', 'Games and Toys', 25.00, 150);

