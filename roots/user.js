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

    if (req.query.dev === "1") {
        res.status(200).render('profile', { name: 'name', email: 'email@email.com', creatat: 'date de création' });
        return
    }
    res.render('profile')

});



//  for maj

router.post('/maj/pp/', (req, res) => {})


module.exports = router;