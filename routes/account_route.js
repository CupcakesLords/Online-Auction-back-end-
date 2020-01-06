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
        res.render('sellerprofile', {
            like,
            user: cur,
            seller: cur.permission === 1,
            nolike: like.length === 0
        });
    }
    else if (cur.permission === 0) {
        const like = await userModel.getlikes(cur.id);
        res.render('bidderprofile', {
            like,
            user: cur,
            bidder: cur.permission === 0,
            nolike: like.length === 0
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

    upload.array('fileProduct', 5)(req, res, function (err) {
        if (err) {

        } else {
            console.log(req.files[0]);
            res.render('uploadproduct');
        }
    })
})

module.exports = router;