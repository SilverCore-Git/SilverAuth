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
const Token = require('../src/token.js');
const config = require('../config.json');
const apikey = require('../src/database/apikey.js');

router.use(expressLayouts);



router.get('/', async (req, res) => {


      const token = req.cookies.silvertoken;
  
  
      if (req.query.dev === "1") {
          res.status(200).render('panel/index', { name: 'name', email: 'email@email.com', creatat: 'date de création', ppimg: '/api/skin/view/pp/default', uuid: 'anbe434c-v7f2-4932-b32c-984a789d79b4' });
          return
      }
  
      await Token.verify(token).then(async (resp) => {
  
          if (resp.valid === true) {
  
              const date = new Date(resp.data.usr_info.createat);
              const formattedDate = date.toLocaleString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
              });
  
              res.render('panel/index', {
                  name: resp.data.usr_info.name,
                  email: resp.data.usr_info.email,
                  creatat: formattedDate, 
                  ppimg: `/api/skin/view/pp/${resp.data.usr_info.name}`,
                  uuid: resp.data.usr_info.dataplus.UUID
              })
  
          }
  
          else {
              res.redirect('/auth/view/login?redirect=/panel/')
          }
  
      })

  });
  
router.get('/users', (req, res) => {
  res.render('panel/users');
});

router.get('/apikey', async (req, res) => {

  const token = req.cookies.silvertoken;

  await Token.verify(token).then(async (resp) => {

    if (resp.valid === true) {

      res.render('panel/apikey');

    }

    else {
      res.redirect('/auth/view/login?redirect=/panel')
    }

  })

});


router.get('/apikey/data', async (req, res) => {

  const token = req.cookies.silvertoken;

  await Token.verify(token).then(async (resp) => {

    if (resp.valid === true) {

      await apikey.GetKeys(resp.data.usr_info.userId).then(respd => {

        res.json(respd);

      })

    }

    else {
     return { error: true, message: 'Session invalide' }
    }

  })

})


router.get('/settings', (req, res) => {
  res.render('panel/settings');
});


router.get('/get/apikeys', (req, res) => {

  const usrid = req.body;

  if (req.hostname === config.hostname) {

    apikey.GetKeys(usrid).then(resp => {

    })

  }

  else {
    res.status(400).json({ error: true, message: 'acces refusé' })
  }

});



module.exports = router;