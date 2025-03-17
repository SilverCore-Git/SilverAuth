/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


// Importation des bibliothèques
const express = require("express");
const path = require('path');
const apikey = require('../src/api_key.js');
const { error } = require("console");
const router = express.Router();


var tempDatabase = [];


router.get('/auth', async (req, res) => { 

    const key = req.query.key;
    const action = req.query.action;         // ?action= peut être login register...
    const redirect = req.query.redirect;     // ?redirect= est l'url vers laquelle l'utilisateur va être rediriger


    const client = await apikey.verify(key);

    const allowed_domains = client.data.data.allowed_domains;
    const allowed_redirect = client.data.data.redirect_urls;

    if (!allowed_domains.includes(req.hostname)) {
        res.status(400).json({ error: true, message: 'Nom de domaine non lié a l\'api key !' });
        return
    }


    if (!allowed_redirect.includes(redirect)) {
        res.status(400).json({ error: true, message: 'Url de redirection non lié a l\'api key !' });
        return
    }


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

        else if (action === 'verify') {

        }

        else {

            res.status(400).json({ error: true, message: 'Action non valide !' });

        }

    };

});



router.get('/redirect', (req, res) => {

    const url = req.query.url;     // ?url= est l'url vers laquelle l'utilisateur va être rediriger
    const token = req.cookies.silvertoken;

    if (!token) {

        res.json({ error: true, message: 'Erreur lors de la récupération du token !' });
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

    res.json(data);

});



module.exports = router;