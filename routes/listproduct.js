const express = require('express');

const listproductModel = require('../models/listproduct_model');

var cheat;
var cheat_expire;

const router = express.Router();

router.get('/', async function (req, res) {
    //const results = await listproductModel.all();
    //res.render('listproduct', {
    //    products: results
    //});
    const page = +req.query.page || 1;
    if (page <= 0) page = 1;
    const prev_value = page - 1;
    const next_value = page + 1;
    const offset = (page - 1) * 3;

    const [total, results] = await Promise.all([
        listproductModel.countByTotal(),
        listproductModel.pageByTotal(offset)
    ])

    const nPages = Math.ceil(total / 3);
    const page_items = [];
    for (i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }

    res.render('listproduct', {
        products: results,       ///////////////////original product list here
        page_items,
        prev_value,
        next_value,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
})

router.get('/byCat/:catId', async function (req, res) {
    for (const c of res.locals.lcCategories) {
        if (c.id === +req.params.catId) {
            c.isActive = true;
        }
    }

    const page = +req.query.page || 1;
    if (page <= 0) page = 1;
    const prev_value = page - 1;
    const next_value = page + 1;
    const offset = (page - 1) * 3;

    const [total, results] = await Promise.all([
        listproductModel.countByCat(req.params.catId),
        listproductModel.pageByCat(req.params.catId, offset)
    ])

    //const total = await listproductModel.countByCat(req.params.catId);
    const nPages = Math.ceil(total / 3);
    const page_items = [];
    for (i = 1; i <= nPages; i++) {
        const item = {
            value: i,
            isActive: i === page
        }
        page_items.push(item);
    }

    //const results = await listproductModel.pageByCat(req.params.catId, offset);
    res.render('listproduct', {
        products: results,
        page_items,
        prev_value,
        next_value,
        can_go_prev: page > 1,
        can_go_next: page < nPages
    });
})

router.get('/:id', async function (req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login');
    }
    const results = await listproductModel.single(req.params.id);
    var between = Date.now() - results[0].UploadDate.getTime();

    cheat = results[0];
    cheat_expire = (results[0].DaysLeft * 86400000) > between;

    const rows = await listproductModel.findLike(req.session.authUser.id, req.params.id);
    const links = await listproductModel.getImages(req.params.id);
    const sell = await listproductModel.getSellerWithProduct(req.params.id);
    const max = await listproductModel.maxBidByID(req.params.id);
    var mb;
    if(max.length === 0) {
        mb = null;
    } else {
        mb = max[max.length - 1];
    }
    res.render('productdetail', {
        product: results[0],
        unsold: results[0].CurrentPrice < results[0].Threshold,
        bidable: (results[0].DaysLeft * 86400000) > between,
        remain: Math.floor(((results[0].DaysLeft * 86400000) - between) / 86400000),
        leastprice: results[0].CurrentPrice + 10,
        notliked: rows.length === 0,
        links,
        seller: sell[0], //name, id
        maxbid: mb, //UserName, UserId
        nobids: max.length === 0,
    });
})

router.post('/:id', async function (req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login');
    }
    if (req.body.BID === undefined || req.body.BID < (cheat.CurrentPrice + 10) || isNaN(req.body.BID)) {
        console.log('Wrong input!')
        return res.redirect(`/listproduct/${cheat.Id}`);
    }
    if (!cheat_expire) {
        console.log('Bidding expired!')
        return res.redirect(`/listproduct/${cheat.Id}`);
    }
    if (cheat.CurrentPrice >= cheat.Threshold) {
        console.log('Product already sold!')
        return res.redirect(`/listproduct/${cheat.Id}`);
    }
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + '/' + mm + '/' + dd;

    const bid = {
        UserId: req.session.authUser.id,
        UserName: req.session.authUser.name,
        ProductId: cheat.Id,
        BidDate: today,
        Price: req.body.BID
    }
    const ret = await listproductModel.add(bid);
    const ret1 = await listproductModel.fixCurrent(cheat.Id, req.body.BID);
    res.redirect(`/listproduct/${cheat.Id}`);
})

router.post('/:id/like', async function (req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login');
    }
    //console.log(req.body.ID);
    const rows = await listproductModel.findLike(req.session.authUser.id, req.body.ID);
    if (rows.length === 0) {
        const like = {
            UserId: req.session.authUser.id,
            ProId: req.body.ID
        }
        const ret = await listproductModel.addLike(like);
    }
    else {
        const ret = await listproductModel.delLike(req.session.authUser.id, req.body.ID);
    }
    res.redirect(`/listproduct/${cheat.Id}`);
})

router.get('/:id/history', async function (req, res) {

    const results = await listproductModel.single(req.params.id);
    const bids = await listproductModel.allBidsByID(req.params.id);
    //console.log(bids.length);
    for (i = 0; i < bids.length; i++) {
        //console.log(bids[i].UserName);
        bids[i].UserName = "******" + bids[i].UserName.substr(bids[i].UserName.length / 2, bids[i].UserName.length);
        //console.log(bids[i].UserName);
    }
    const temp = req.params.id;

    res.render('historybid', {
        product: results[0],
        temp,
        bids,
        nobids: bids.length === 0,
    });
})

module.exports = router;