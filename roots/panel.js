/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/


// packages
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const router = express.Router();

// require

router.use(expressLayouts);


// router.get('/:view', (req, res) => {
//     res.render('panel/index', { view: req.params.view })
// });

// router.get('/users', (req, res) => {
//     res.render('panel/users')
// });


router.get('/', (req, res) => {
    res.render('panel/index');
  });
  
  router.get('/users', (req, res) => {
    res.render('panel/users');
  });
  
  router.get('/api-management', (req, res) => {
    res.render('panel/api-management');
  });
  
  router.get('/settings', (req, res) => {
    res.render('panel/settings');
  });





module.exports = router;