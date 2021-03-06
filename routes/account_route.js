const express = require('express');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user_model');
const multer = require('multer');
//const upload = multer({ dest:'images/user/' });

const router = express.Router();

router.get('/register', async function (req, res) {
    res.render('registration');
})

router.get('/login', async function (req, res) {
    res.render('login');
})

router.get('/profile', async function (req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login');
    }
    const cur = req.session.authUser;
    if (cur.permission === 2) {
        res.render('adminprofile', { layout: 'main2' });
    }
    else if (cur.permission === 1) {
        const like = await userModel.getlikes(cur.id);
        const bid = await userModel.getbids(cur.id);
        const bought = await userModel.getBought(cur.id);
        const sell = await userModel.getSelling(cur.id);
        const sold = await userModel.getSold(cur.id);
        const review = await userModel.getReviewsWithID(cur.id);
        res.render('sellerprofile', {
            like,
            bid,
            bought,
            sell,
            sold,
            review,
            user: cur,
            seller: cur.permission === 1,
            nolike: like.length === 0,
            nobid: bid.length === 0,
            nosell: sell.length === 0,
            nosold: sold.length === 0,
            nobought: bought.length === 0,
            noreview: review.length === 0
        });
    }
    else if (cur.permission === 0) {
        const like = await userModel.getlikes(cur.id);
        const bid = await userModel.getbids(cur.id);
        const bought = await userModel.getBought(cur.id);
        const review = await userModel.getReviewsWithID(cur.id);
        res.render('bidderprofile', {
            like,
            bid,
            bought,
            review,
            user: cur,
            bidder: cur.permission === 0,
            nolike: like.length === 0,
            nobid: bid.length === 0,
            nobought: bought.length === 0,
            noreview: review.length === 0
        });
    }
})

router.post('/logout', async function (req, res) {
    req.session.isAuthenticated = false;
    req.session.authUser = null;
    res.redirect('/');
})

router.post('/login', async function (req, res) {
    const user = await userModel.singleByUserName(req.body.username);
    if (user === null) {
        return res.render('login', {
            err_message: 'Invalid username or password'
        })
    }
    const rs = bcrypt.compareSync(req.body.password, user.password_hash);
    if (rs === false) {
        return res.render('login', {
            err_message: 'Invalid password or password'
        })
    }
    delete user.password_hash;
    req.session.isAuthenticated = true;
    req.session.authUser = user;
    console.log(user.permission);
    res.redirect('/account/profile');
})

router.post('/register', async function (req, res) {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY/MM/DD');
    console.log(req.body.dob);
    const entity = {
        username: req.body.username, //name, not id
        password_hash: hash,
        name: req.body.name,
        email: req.body.email,
        dob,
        permission: 0
    }
    const user = await userModel.singleByUserName(req.body.username);
    if (!(user === null)) {
        return res.render('registration', {
            err_message: 'Username already existed!'
        })
    }
    if (!(req.body.password === req.body.re_password)) {
        return res.render('registration', {
            err_message: 'Password and retyped password do not match!'
        })
    }
    const ret = await userModel.add(entity);
    res.render('registration');
})

router.get('/upload', async function (req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login');
    }
    const cur = req.session.authUser;
    if (cur.permission === 1) {
        res.render('uploadproduct');
    }
    else {
        res.redirect('/');
    }
})

router.post('/upload', async function (req, res) {
    //console.log(req.body.descriptionProduct);
    //console.log(req.body.cate);
    //res.send('ok');
    const storage = multer.diskStorage({
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        },
        destination: function (req, file, cb) {
            cb(null, `./images/user/`)
        },
    });
    const upload = multer({ storage });

    upload.array('fileProduct', 5)(req, res, async function (err) {
        if (err) {
            res.send('errors when uploading images');
        }
        else {
            //console.log(req.files[0]);
            if (req.files.length === 0 || req.files === undefined) {
                return res.render('uploadproduct', {
                    err_message: 'Product images are required!'
                });
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
            const entity = {
                ProductName: req.body.nameProduct,
                CurrentPrice: req.body.startingPriceProduct,
                HighestPrice: req.body.bestPrice,
                Threshold: req.body.bestPrice,
                UploadDate: today,
                DaysLeft: req.body.stepPriceProduct, //number of bid day
                Bids: 0,
                Image: '\\' + req.files[0].path,
                CatID: req.body.cate,
                SellerID: req.session.authUser.id,
                Description: req.body.descriptionProduct,
            }
            console.log(entity);
            if (req.body.startingPriceProduct >= req.body.bestPrice) {
                //console.log("Price not okay!");
                return res.render('uploadproduct', {
                    err_message: 'Starting price needs to be lower than threshold price!'
                });
            }
            else if (req.body.cate === undefined || req.body.cate === 0) {
                console.log("Categories not okay!");
                return res.render('uploadproduct', {
                    err_message: 'Please pick a category for your product!'
                });
            }
            else {
                const ret = await userModel.uploadProduct(entity);
                const link = req.body.nameProduct;
                const ID = await userModel.getIdWithImage(link);
                console.log(ID[0].Id);
                for (const c of req.files) {
                    const temp = {
                        ProId: ID[0].Id,
                        Link: '\\' + c.path,
                    }
                    const ret1 = await userModel.addImage(temp);
                }
                return res.render('uploadproduct');
            }
        }
    })

})

router.get('/review/:id', async function (req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login');
    }
    const pro = await userModel.singlePro(req.params.id);
    const cur = req.session.authUser;
    var user; var target;
    if (cur.permission === 0) { //người mua review
        user = cur; target = pro[0].SellerID;
    }
    else if (cur.permission === 1) { //người mua review
        user = cur;
        const temp = await userModel.getWinnerWithProID(pro[0].Id);
        target = temp[0].UserId;
    }
    res.render('review', {
        product: pro[0],
        user,
        target,
    });
})

router.post('/review/:id', async function (req, res) {
    if (req.body.rev === undefined || req.body.rev === 0) {
        console.log("Like or not?");
        return res.redirect(`/account/review/${req.body.ProId}`);
    }
    if (req.body.feedback === undefined || req.body.feedback === '') {
        console.log("What do you think?")
        return res.redirect(`/account/review/${req.body.ProId}`);
    }
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var mi = today.getMinutes();
    var ss = today.getSeconds();
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
    if (hh < 10) { hh = '0' + hh; }
    if (mi < 10) { mi = '0' + mi; }
    if (ss < 10) { ss = '0' + ss; }
    today = yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ':' + ss;
    const rev = {
        UserId: req.body.UserId,
        ProId: req.body.ProId,
        TargetId: req.body.TargetId,
        Upvote: req.body.rev === '1',
        ReviewDate: today,
        Review: req.body.feedback
    }
    console.log(rev);
    const ahihi = await userModel.addReview(rev);
    res.redirect(`/account/review/${req.body.ProId}`);
})

router.get('/admin/listcategory', async function (req, res) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/account/login');
    }
    const cur = req.session.authUser;
    if (!cur.permission === 3) {
        return res.redirect('/');
    }
    res.render('adminlistcategories', { layout: 'main2' });
})

router.post('/admin/listcategory/delete', async function (req, res) {
    if(req.body.PN === 0) {
        console.log('Cant delete categories with products.')
        res.redirect('/account/admin/listcategory');
    }
    console.log('ok lets delete');
    //const ret = userModel.deleteCate(req.body.ID);
    res.redirect('/account/admin/listcategory');
})

module.exports = router;