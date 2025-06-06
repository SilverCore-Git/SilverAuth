/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


// Importation des bibliothèques
const express = require("express");
const apikey = require('../src/api_key.js');
const Token = require('../src/token.js');
const router = express.Router();
require('dotenv').config(); 


var tempDatabase = [];


router.get('/auth', async (req, res) => { 

    const token = req.cookies.silvertoken;
    const key = req.query.key;
    const action = req.query.action;         // ?action= peut être login register...
    const redirect = req.query.redirect;     // ?redirect= est l'url vers laquelle l'utilisateur va être rediriger


    if (key === process.env.DEV_APIKEY) {

        if (action === 'login') {

            const verifyToken = await Token.verify(token);

            if (verifyToken.valid) {
                return res.redirect(`/popup/redirect?url=${redirect}`)
            }

            res.status(200).render('login', { redirect: redirect, organisationName: 'dev access' }); 

        }

        else if (action === 'register') {

            res.status(200).render('register', { redirect: redirect });

        }

        else {

            res.status(400).json({ error: true, message: 'Action non valide !' });

        }
        return

    } else {

        const client = await apikey.verify(key);

        if (client.error) {
            return res.status(400).json({ error: true, message: 'Clé d\'api non valide !' })
        }

        const allowed_redirect = client.data.data.redirect_urls;

        if (allowed_redirect.includes(redirect)) {}
        else { return res.status(400).json({ error: true, message: 'Url de redirection non lié a l\'api key !' }) }


        if (!client.valid) {

            res.status(500).json( { error: true, message: 'La clé d\'api n\'est pas valid !' } )

        }

        else if (client.error) {

            res.status(500).json( { error: true, message: { silver: 'Une erreur est survenur !', server: client.message } } );

        }

        else {
            
            if (action === 'login') {

                res.status(200).render('login', { redirect: redirect, organisationName: client.data.data.organization_name });

            }

            else if (action === 'register') {

                res.status(200).render('register', { redirect: redirect, organisationName: client.data.data.organization_name });

            }

            else {

                res.status(400).json({ error: true, message: 'Action non valide !' });

            }

        };

    };

});



router.get('/redirect', (req, res) => {

    const url = req.query.url;     // ?url= est l'url vers laquelle l'utilisateur va être rediriger
    const token = req.cookies.silvertoken;

    if (!token) {

        res.redirect('/auth/view/login');
        return

    };

    if (!url) {

        res.json({ error: true, message: 'Erreur lors de la récupération de l\'url de redirection  !' });
        return

    };

    const sessionID = Math.floor(Math.random() * 90000000000000000000) + 100000000000000000000;
    tempDatabase.push( { id: sessionID, token: token } );

    res.redirect(`${url}?id=${sessionID}`);

});



router.get('/getaccount/:id', (req, res) => {

    const id = req.params.id;
    const Sid = Number(id);

    function getLineById(id) {
        const result = tempDatabase.find(item => item.id === id);
        return result ? result : null;
    }

    const data = getLineById(Sid);

    if (!data) {
        return res.status(404).json({ error: 'Données non trouvées' });
    }

    res.cookie('silvertoken', data.token, {
        httpOnly: false,
        secure: true,
        maxAge: 2 * 24 * 60 * 60 * 1000, 
        sameSite: 'Strict'
    });

    tempDatabase = tempDatabase.filter(item => item.id !== Sid);

    res.json(data);
});




module.exports = router;