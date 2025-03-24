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
const account = require('../src/database/account.js');
const deleteAPIKEY = apikey.delete;

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
  


router.get('/admin/users', (req, res) => {
  res.render('panel/admin/users');
});

router.get('/admin/apikey', (req, res) => {
  res.render('panel/admin/apikey');
});

router.get('/admin', (req, res) => {
  res.render('panel/admin/admin');
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


router.get('/apikey/data/admin', async (req, res) => {

  const token = req.cookies.silvertoken;

  await Token.verify(token).then(async (resp) => {

    if (resp.valid === true) {

      if (resp.data.usr_info.dataplus.role === 'ADMIN') {

        await apikey.GetKeys(resp.data.usr_info.dataplus.role).then(respd => {

          res.json(respd);
  
        })

      }

    }

    else {
     return { error: true, message: 'Session invalide' }
    }

  })

})


router.get('/users/data/', async (req, res) => {

  const token = req.cookies.silvertoken;

  await Token.verify(token).then(async (resp) => {

    if (resp.valid === true) {

      if (resp.data.usr_info.dataplus.role === 'ADMIN') {

        await account.GetAccounts('ADMIN').then(respd => {

          res.json(respd);
  
        })

      }

    }

    else {
     return { error: true, message: 'Session invalide' }
    }

  })

})


router.get('/users/update/:usrid', async (req, res) => { // voir la root

  const usrID = req.params.usrid;
  const token = req.cookies.silvertoken;

  await Token.verify(token).then(async (resp) => {

    if (resp.valid === true) {

      if (resp.data.usr_info.dataplus.role === 'ADMIN') {

        await account.GetAccounts('ADMIN').then(respd => {

          res.json(respd);
  
        })

      }

    }

    else {
     return { error: true, message: 'Session invalide' }
    }

  })

})




router.get('/users/data/:id', async (req, res) => {

  const id = req.params.id;
  const token = req.cookies.silvertoken;

  await Token.verify(token).then(async (resp) => {

    if (resp.valid === true) {

      if (resp.data.usr_info.dataplus.role === 'ADMIN') {

        await account.GetAccounts(id).then(respd => {

          res.json(respd);
  
        })

      }

    }

    else {
     return { error: true, message: 'Session invalide' }
    }

  })

})





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


router.use((req, res, next) => {
  const originalJson = res.json;
  
  // Surcharger la méthode .json de Express pour gérer les BigInt
  res.json = function (body) {
      if (typeof body === 'object' && body !== null) {
          body = handleBigInt(body);
      }
      return originalJson.call(this, body);
  };
  
  next();
});

// Fonction pour gérer les BigInt
function handleBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value // Convertir BigInt en string
  ));
}


router.post('/apikey/key/add', async (req, res) => {

  try {

    const organisationName = req.query.name;
    const token = req.cookies.silvertoken;

    if (req.hostname !== config.hostname) {
        return res.status(403).json({ error: true, message: { silver: "Accès refusé" } });
    }

    const tokenResp = await Token.verify(token);
    if (!tokenResp.valid) {
        return res.status(401).json({ error: true, message: { silver: "Token invalide" } });
    }

    await apikey.create(tokenResp.data.usr_info.userId, organisationName ).then(resp => {

      if (resp.error) {
        return res.status(400).json({ error: true, message: { silver: 'Une erreur est survenue', server: resp.message }, data: resp });
      }
      else {
        return res.status(200).json({ message: 'Clé crée avec success', data: resp });
      };

    })


  } catch (error) {

    console.error('Erreur APIKey update:', error);
    return res.status(500).json({ error: true, message: { silver: "Erreur serveur" } });

  }

})

router.post('/apikey/key/remove/:key', async (req, res) => {

  try {

    const apikey = req.params.key;
    const token = req.cookies.silvertoken;

    // Vérification du domaine
    if (req.hostname !== config.hostname) {
        return res.status(403).json({ error: true, message: { silver: "Accès refusé" } });
    }

    // Vérification du token
    const tokenResp = await Token.verify(token);
    if (!tokenResp.valid) {
        return res.status(401).json({ error: true, message: { silver: "Token invalide" } });
    }

    // Appel à la méthode delete
    const resp = await deleteAPIKEY(apikey);


    if (resp.error) {
      return res.status(400).json({ error: true, message: { silver: 'Une erreur est survenue', server: resp.message }, data: resp });
    }

    // Si la suppression est réussie
    return res.status(200).json({ message: resp.message, data: resp });

  } catch (error) {

    // Gestion d'erreur serveur
    console.error('Erreur lors de la suppression de la clé API:', error);
    return res.status(500).json({ error: true, message: { silver: "Erreur serveur" } });

  }

});




module.exports = router;