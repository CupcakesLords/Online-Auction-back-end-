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
    singlePro: id => db.load(`select * from Product where Id = ${id}`),
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
    getSelling: userID => db.load(`
    SELECT * FROM Product
    WHERE NOW() BETWEEN UploadDate AND DATE_ADD(UploadDate, INTERVAL DaysLeft DAY) AND CurrentPrice < Threshold AND SellerID = ${userID};
    `),
    getSold: userID => db.load(`
    select * from Product 
    where CurrentPrice > Threshold and SellerID = ${userID}`),
    getBought: userID => db.load(`
    select P.* 
    from SucBids S
    join Product P on S.ProductId = P.Id
    where S.UserId = ${userID};
    `),
    uploadProduct: entity => db.add(entity, 'Product'),
    getIdWithImage: link => db.load(`select Id from Product where ProductName = '${link}'`),
    addImage: temp => db.add(temp, 'Images'),
    getWinnerWithProID: id => db.load(`select * from SucBids where ProductId = ${id}`),
    addReview: rev => db.add(rev, 'Reviews'),
    getReviewsWithID: id => db.load(`select * from Reviews where TargetId = ${id}`),
    deleteCate: id => db.load(`DELETE FROM ECate WHERE id = ${id}`),
}