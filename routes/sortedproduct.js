const express = require('express');

const listproductModel = require('../models/listproduct_model');

const router = express.Router();

router.get('/byCat/:catId', async function(req, res){
    const links = await listproductModel.allECate();
    const results = await listproductModel.allByCat(req.params.catId);
    console.log(results[0].Image);
    res.render('listproduct', {
        links: links,
        products: results
    });
})

module.exports = router;