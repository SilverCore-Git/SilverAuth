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



// ex d'utilisation :
router.get('/auth', async (req, res) => { 

    // const key = req.headers['APIKey']    // recupération de la clé d'api stocké dans le head de la raquete
    const key = req.query.key
    const action = req.query.action         // ?action= peut être login register...
    const redirect = req.query.redirect     // ?redirect= est l'url vers laquelle l'utilisateur va être rediriger

    const client = await apikey.verify(key);


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

        else {

            res.status(400).json({ error: true, message: 'Action non valide !' });

        }

    };

});



module.exports = router;