/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/


// packages
const express = require("express");
const router = express.Router();

// require




router.get('/', (req, res) => {
    res.redirect('/user/profile');
});


router.get('/profile', (req, res) => {

    res.render('profile')

});


module.exports = router;