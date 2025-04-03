/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/


// packages
const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs')

// require
const GetHeadSkin = require('../src/utils/getheadskin.js');



router.get('/', (req, res) => {
    res.status(404).json(404);
});


router.get('/view/head/:player', (req, res) => {

    const player = req.params.player;

    if (!player) {
        return res.status(200).sendFile( path.join( __dirname, '../data/skinapi/default/head.png' ) );
    }

    try {

        if (player === 'default') {

            res.status(200).sendFile( path.join( __dirname, '../data/skinapi/default/head.png' ) );

        } else {

            const itemPath = path.join( __dirname, `../data/skinapi/head/${player}.png` );

            if (fs.existsSync(itemPath)) {

                res.sendFile(itemPath);

            } else {

                res.status(500).json({ error: true, message: "nom d'utilisateur incorect." });

            };

        };

    }

    catch (err) {

        res.status(500).json({ error: true, message: { silver: 'Erreur lors de la recupération ou l\'envoie du de l\image', server: err || err.message } });

    };
 
});


router.get('/view/skin/:player', (req, res) => {

    const player = req.params.player;

    if (!player) {
        return  res.status(200).sendFile( path.join( __dirname, '../data/skinapi/default/skin.png' ) );
    }


    try {

        if (player === 'default') {

            res.status(200).sendFile( path.join( __dirname, '../data/skinapi/default/skin.png' ) );

        } else {

            const itemPath = path.join( __dirname, `../data/skinapi/skin/${player}.png` );

            if (fs.existsSync(itemPath)) {

                res.sendFile(itemPath);

            } else {

                res.status(500).json({ error: true, message: "nom d'utilisateur incorect." });

            };

        };

    }

    catch (err) {

        res.status(500).json({ error: true, message: { silver: 'Erreur lors de la recupération ou l\'envoie du de l\image', server: err || err.message } });

    };


});


router.get('/view/pp/:player', (req, res) => {

    const player = req.params.player;

    if (!player) {
        res.status(200).sendFile( path.join( __dirname, '../data/pp/default.png' ) );
        return
    }


    try {

        if (player === 'default') {

            res.status(200).sendFile( path.join( __dirname, '../data/pp/default.png' ) );

        } else {

            const itemPath = path.join( __dirname, `../data/pp/all/${player}.png` );

            if (fs.existsSync(itemPath)) {

                res.sendFile(itemPath);

            } else {

                res.status(500).json({ error: true, message: "nom d'utilisateur incorect." });

            };

        };

    }

    catch (err) {

        res.status(500).json({ error: true, message: { silver: 'Erreur lors de la recupération ou l\'envoie du de l\image', server: err || err.message } });

    };


});


router.get('/create/headbyskin', (req, res) => {



});


module.exports = router;