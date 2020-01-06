DROP DATABASE IF EXISTS ProductList;
CREATE DATABASE ProductList;

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'uyen9999@';

Use ProductList;

CREATE TABLE Product (
 Id INT NOT NULL auto_increment,
 ProductName VARCHAR(255) NOT NULL,
 CurrentPrice DOUBLE NOT NULL,
 HighestPrice DOUBLE NOT NULL,
 Threshold DOUBLE NOT NULL,
 UploadDate DATE NOT NULL,
 DaysLeft INT NOT NULL,
 Bids INT NOT NULL,
 Image VARCHAR(255) NOT NULL,
 CatID INT NOT NULL,
 SellerID INT NOT NULL,
 Description VARCHAR(1000) NOT NULL,
 PRIMARY KEY (Id));
 
INSERT INTO Product VALUES(1, 'Macbook Pro 2017', 150, 500, 1600, '2019-12-20', 100, 15, '/images/laptop/laptop-macbookpro-2017.png', 1, 17, 'No description');
INSERT INTO Product VALUES(2, 'Vivobook 14', 200, 700, 1000, '2019-12-20', 100, 11, '/images/laptop/laptop-vivobook-14.png', 1, 17, 'No description');
INSERT INTO Product VALUES(3, 'Laptop xps 15', 300, 600, 2000, '2019-12-20', 100, 14, '/images/laptop/laptop-xps15.png', 1, 17, 'No description');
INSERT INTO Product VALUES(4, 'Phone 1', 100, 200, 1000, '2019-12-20', 100, 5, '/images/phone/phone1.png', 2, 17, 'No description');
INSERT INTO Product VALUES(5, 'Phone 2', 100, 200, 1000, '2019-12-21', 100, 5, '/images/phone/phone2.png', 2, 17, 'No description');
INSERT INTO Product VALUES(6, 'Phone 3', 100, 200, 1000, '2019-12-21', 100, 5, '/images/phone/phone3.png', 2, 17, 'No description');
INSERT INTO Product VALUES(7, 'Phone 4', 100, 200, 1000, '2019-12-21', 100, 5, '/images/phone/phone4.png', 2, 17, 'No description');
INSERT INTO Product VALUES(8, 'Phone 5', 100, 200, 1000, '2019-12-21', 100, 5, '/images/phone/phone5.png', 2, 17, 'No description');
INSERT INTO Product VALUES(9, 'Laptop RedMiBook', 300, 600, 2000, '2019-12-11', 10, 14, '/images/laptop/laptop-redmibook.png', 1, 17, 'No description');
INSERT INTO Product VALUES(10, 'Laptop Rog Strix', 300, 600, 2000, '2019-12-11', 10, 14, '/images/laptop/laptop-rog-strix.png', 1, 17, 'No description');

DROP TABLE Product;
SELECT * FROM Product;

CREATE TABLE Users (
 id INT NOT NULL auto_increment,
 username VARCHAR(50) NOT NULL,
 password_hash VARCHAR(255) NOT NULL,
 name VARCHAR(50) NOT NULL,
 email VARCHAR(50) NOT NULL,
 dob DATETIME NOT NULL,
 permission INT,
 PRIMARY KEY (id));
 
 SELECT * FROM Users;

CREATE TABLE ECate (
id INT NOT NULL auto_increment,
category VARCHAR(50) NOT NULL,
PRIMARY KEY(id));

INSERT INTO ECate VALUES(1, 'Laptop');
INSERT INTO ECate VALUES(2, 'Smart phone');

DROP TABLE ECate;
SELECT * FROM ECate;

SELECT c.id, c.category, count(p.Id) AS ProNum
FROM ECate c LEFT JOIN Product p ON c.id = p.CatID
GROUP BY c.id, c.category;

CREATE TABLE Bids (
 Id INT NOT NULL auto_increment,
 UserId VARCHAR(50) NOT NULL,
 UserName VARCHAR(50) NOT NULL,
 ProductId VARCHAR(50) NOT NULL,
 BidDate DATETIME NOT NULL,
 Price DOUBLE NOT NULL,
 PRIMARY KEY (id));
 
 SELECT * FROM Bids;
 DROP TABLE Bids;
 DROP TABLE Likes;
 
 CREATE TABLE Likes (
 Id INT NOT NULL auto_increment,
 UserId VARCHAR(50) NOT NULL,
 ProId VARCHAR(50) NOT NULL,
 PRIMARY KEY(Id));
 
SELECT P.ProductName, P.Image, U.name, P.UploadDate, P.DaysLeft, P.CurrentPrice, P.Threshold, P.Id, P.SellerID
FROM Product P 
JOIN Likes L ON P.Id = L.ProId
JOIN Users U ON L.UserId = U.id 
WHERE U.id = 16;

SELECT * FROM Likes L
WHERE L.UserId = 16

