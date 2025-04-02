/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/


// packages
const express = require("express");
const router = express.Router();
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { randomUUID } = require('crypto');

// require
const Token = require('../src/token.js');
const AccountConnect = require('../src/auth/connect.js');
const account = require('../src/database/account.js');

const cfg = require('../config.json')


const skinurl = `${cfg.hostname}/api/skin/view/skin`;
const headurl = `${cfg.hostname}/api/skin/view/head`;
const defaultPPURL = `${cfg.hostname}/api/skin/view/pp`;


router.get('/', (req, res) => {
    res.json({ error: true, message: 'action non valide !' })
});


router.post('/register', async (req, res) => { 

    const { mail, passwd, name, key, ip } = req.body;

    if (key !== process.env.REGISTER_KEY) {
        res.status(403).json( { error: true, message: "La clé n'est pas valide !" } );
        return; 
    };

    try {

        const nameFirstLetter = name.charAt(0); 
        const nameLastLetter = name.charAt(name.length - 1);
        const uuid = randomUUID();
        const newUuid = `${nameFirstLetter}${nameLastLetter}${uuid.slice(2)}`;

        await account.create(mail, name, passwd, 'USER', { 

            UUID: newUuid,

            ip: ip,

            url: {

                skin: { 

                    skin: `${skinurl}`, 
                    head: `${headurl}` 

                },

                pp: `${defaultPPURL}`,

            },

            banned: false 

        })

        .then(resp => {

            const sanitizedResp = JSON.parse(JSON.stringify(resp, (key, value) => {

                if (typeof value === 'bigint') {

                    return value.toString();

                }

                return value;

            }));
            
            if (sanitizedResp.error) {

                res.status(401).json({ error: true, statu: 'error', resp: sanitizedResp });

            } else {

                async function createIMGAccountFile(name) {

                    const defaultSkinURL = path.join( __dirname, '../data/skinapi/default/skin.png' );
                    const defaultHeadURL = path.join( __dirname, '../data/skinapi/default/head.png' );
                    const defaultPPURL = path.join( __dirname, '../data/pp/default.png' );

                    const SkinURL = path.join( __dirname, `../data/skinapi/skin/${name}.png` );
                    const HeadURL = path.join( __dirname, `../data/skinapi/head/${name}.png` );
                    const PPURL = path.join( __dirname, `../data/pp/all/${name}.png` );

                    fs.copyFileSync(defaultSkinURL, SkinURL);
                    fs.copyFileSync(defaultHeadURL, HeadURL);
                    fs.copyFileSync(defaultPPURL, PPURL);

                }

                createIMGAccountFile(name);


                res.status(200).json({ statu: 'success', message: 'Compte créer avec succes !', resp: sanitizedResp });

            }

        })

        .catch(err => {

            res.status(500).json({ error: true, message: { silver: 'Erreur lors de la création du compte', step: 2, server: err || err.message } });
        
        });

    }

    catch (err) {

        res.status(500).json({ error: true, message: { silver: 'Erreur lors de la création du compte', step: 1, server: err || err.message } });

    };


});


router.post('/login', async (req, res) => {

    const { mail, passwd } = req.body;


    try {
 
        await AccountConnect(mail, passwd).then(resp => {

            if (resp.error) {
                
                res.status(200).json( { statu: 'error', data: resp } );
                return

            }

            res.cookie('silvertoken', resp.token, {

                httpOnly: true,
                secure: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, 
                sameSite: 'Strict'
        
            });

            res.status(200).json( { statu: 'success', data: resp } );

        });

    }

    catch (err) {

        res.status(500).json( { error: true, massage: { silver: 'Une erreur est survenue !', server: err.message || err } } );

    };


});


router.get('/verify', async (req, res) => {

    const token = req.cookies.silvertoken;

    
    try {

        await Token.verify(token).then(resp => {

            res.json(resp)

        });

    }

    catch (err) {

        res.status(500).json( { error: true, message: { silver: 'Une erreur est survenue !', server: err || err.message } } );

    }

});


router.get('/logout', async (req, res) => {


    try {

        res.clearCookie('silvertoken');

        res.json(true);

    }

    catch (err) {

        res.json({ error: true, message: { silver: 'Une erreur est survenue !', massage: err || err.message } });

    };

});


router.get('/view/:action', (req, res) => {

    const action = req.params.action;
    const Redirect = req.query.redirect;

    if (Redirect) {

        if (action === 'login') {
            res.status(200).render('login', { redirect: Redirect, organisationName: 'SilverAuth' });
        } else if (action === 'register') {
            res.status(200).render('register');
        };

    }

    else {

        if (action === 'login') {
            res.status(200).render('login', { redirect: '/', organisationName: 'SilverAuth' });
        } else if (action === 'register') {
            res.status(200).render('register');
        };

    };

});


router.get('/get/key/for/register', (req, res) => {

    if (req.hostname === cfg.hostname) {
        if (req.query.d === 'olala') {
            if (req.query.ml === '456') {
                res.json({ key: process.env.REGISTER_KEY });
            }
        }
    }

})


module.exports = router;