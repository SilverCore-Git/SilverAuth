 /**
  * @author SilverCore
  * @author SilverAuth
  * @author MisterPapaye
  */
 
 
 // Importation des bibliothèques
 const express = require("express");
 const router = express.Router();
 const { createToken, verifyToken } = require('../token.js');
 const AccountConnect = require('../auth/connect.js');
 const account = require('../database/account.js');

 
 
 router.get('/token', (req, res) => {
 
    const id = req.query.id;
    const mail = req.query.mail;
    const token = createToken(id, mail);

    res.json({token});
 
 })

 router.get('/auth/:action', async (req, res) => {
    
    const action = req.params.action;
    const mail = req.query.mail;
    const name = req.query.name;
    const passwd = req.query.passwd;
    const ip = req.ip || req.connection.remoteAddress;

    if (action === 'login') {

        await AccountConnect(mail, passwd).then(resp => {

            res.json( { resp } );

        });

    }

    else if (action === 'register') {

        account.create(mail, name, passwd, 'USER', { ip: ip, dataplus: 'ça marche ?' })

        .then(resp => {

            const sanitizedResp = JSON.parse(JSON.stringify(resp, (key, value) => {
                if (typeof value === 'bigint') {
                    return value.toString();
                }
                return value;
            }));
            
            res.json({ resp: sanitizedResp });
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: true, message: 'Erreur lors de la création du compte' });
        });
    }
    

    else if (action === 'info') {

        account.info(mail).then(resp => {

            res.json( { resp } );

        });

    }

    else {

        res.json({ error: true, message: 'action non valide !' })

    }

 })

 
 router.get('/auth/verify/:token', (req, res) => {

    const token = req.params.token;


    verifyToken(token).then(resp => {

        res.json(resp)

    })


 })


 router.get('/', (req, res) => {
    res.json({ message: 'dev access'});
 })
 
 
 
 module.exports = router;