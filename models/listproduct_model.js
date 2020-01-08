const db = require('../utils/db');

module.exports = {
    all: _ => db.load('select * from Product'),
    allECate: _ => db.load('select * from ECate'),
    allByCat: catId => db.load(`select * from Product where CatID = ${catId}`),
    pageByCat: (catId, offset) => db.load(`select * from Product where CatID = ${catId} limit ${3} offset ${offset}`),
    countByCat: async catId => { 
        const rows = await db.load(`select count(*) as total from Product where CatID = ${catId}`);
        return rows[0].total;
    },
    pageByTotal: offset => db.load(`select * from Product limit ${3} offset ${offset}`),
    countByTotal: async _ => {
        const rows = await db.load(`select count(*) as total from Product`);
        return rows[0].total;
    },
    allCatWithDetails: _ => {
        const sql = `SELECT c.id, c.category, count(p.Id) AS ProNum
        FROM ECate c LEFT JOIN Product p ON c.id = p.CatID
        GROUP BY c.id, c.category`;
        return db.load(sql);
    },
    single: id => db.load(`select * from Product where Id = ${id}`),
    add: bid => db.add(bid, 'Bids'),
    allBidsByID: id => db.load(`select * from Bids where ProductId = ${id}`),
    countBidsByID: id => db.load(`select count(*) as total from Bids where ProductId = ${id}`),
    maxBidByID: id => db.load(`select UserName, UserId from Bids where ProductId = ${id}`),
    fixCurrent: (id, newprice) => db.load(`update Product set CurrentPrice = ${newprice} where Id = ${id}`),
    //UPDATE `productlist`.`Product` SET `CurrentPrice` = '200' WHERE (`Id` = '7');
    addLike: like => db.add(like, 'Likes'),
    findLike: (UserID, ProId) => db.load(`select * from Likes where UserId = ${UserID} and ProId = ${ProId}`),
    delLike: (UserID, ProId) => db.load(`delete from Likes where UserId = ${UserID} and ProId = ${ProId}`),
    getImages: ID => db.load(`select Link from Images where ProId = ${ID}`),
    getSellerWithProduct: ProId => db.load(`
    select U.name, U.id
    from Product P
    join Users U on P.SellerID = U.id
    where P.Id = ${ProId}
    `),
}