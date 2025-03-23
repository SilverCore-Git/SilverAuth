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




router.post('/apikey/key/maj/:key', async (req, res) => {

  try {

      const body = req.body;
      const apiKey = req.params.key;
      const token = req.cookies.silvertoken;

      if (req.hostname !== config.hostname) {
          return res.status(403).json({ error: true, message: { silver: "Accès refusé" } });
      }

      const tokenResp = await Token.verify(token);
      if (!tokenResp.valid) {
          return res.status(401).json({ error: true, message: { silver: "Token invalide" } });
      }

      const updateResp = await apikey.update(apiKey, {
          organizationName: body.Name,
          allowedDomains: body.Domaines,
          redirectUrls: body.Redirects
      });

      if (updateResp.error) {
          return res.status(500).json({ error: true, message: { silver: updateResp.message } });
      }

      return res.status(200).json({ message: { silver: "Mise à jour réussie" }, data: body });

  } catch (error) {
    
      console.error('Erreur APIKey update:', error);
      return res.status(500).json({ error: true, message: { silver: "Erreur serveur" } });

  }

});




module.exports = router;