const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from Users'),
    add: entity => db.add(entity, 'Users'),
    singleByUserName: async username => {
        //console.log(username);
        const rows = await db.load(`select * from Users where username = '${username}'`)
        //console.log(rows[0]);
        if (rows.length > 0)
            return rows[0];

        return null;
    },
    getlikes: userID => db.load(`
    SELECT P.ProductName, P.Image, U.name, P.UploadDate, P.DaysLeft, P.CurrentPrice, P.Threshold, P.Id, P.SellerID
    FROM Product P 
    JOIN Likes L ON P.Id = L.ProId
    JOIN Users U ON P.SellerID = U.id 
    WHERE L.UserId = ${userID}`),
    getbids: userID => db.load(`
    SELECT P.ProductName, P.Image, U.name, P.UploadDate, P.DaysLeft, P.CurrentPrice, P.Threshold, P.Id, P.SellerID
    FROM Product P 
    JOIN Bids L ON P.Id = L.ProductId
    JOIN Users U ON P.SellerID = U.id 
    WHERE L.UserId = ${userID}`),
    uploadProduct: entity => db.add(entity, 'Product'),
    getIdWithImage: link => db.load(`select Id from Product where ProductName = '${link}'`),
    addImage: temp => db.add(temp, 'Images'),
}