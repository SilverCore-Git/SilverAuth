/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/


// packages
const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser');

// require
const { verifyToken } = require('../src/token.js');
const AccountConnect = require('../src/auth/connect.js');
const account = require('../src/database/account.js');
const { TimeSeriesAggregationType } = require("redis");

const cfg = require('../config.json')


const skinurl = `${cfg.hostname}/api/skin/view/skin`;
const headurl = `${cfg.hostname}/api/skin/view/head`;
const defaultPPURL = `${cfg.hostname}/api/skin/view/pp`;


router.get('/', (req, res) => {
    res.json({ error: true, message: 'action non valide !' })
});


router.get('/register', async (req, res) => { 

    const mail = req.query.mail;
    const name = req.query.name;
    const passwd = req.query.passwd;
    const dataplus = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    GetHeadbySkin('', '')

    try {

        await account.create(mail, name, passwd, 'USER', { 

            ip: ip, 

            skin: { 

                skin: `${skinurl}/${name}`, 
                head: `${headurl}/${name}` 

            },

            pp: `${defaultPPURL}/${name}`,

            plus: dataplus

        })

        .then(resp => {

            const sanitizedResp = JSON.parse(JSON.stringify(resp, (key, value) => {

                if (typeof value === 'bigint') {

                    return value.toString();

                }

                return value;

            }));
            
            if (sanitizedResp.error) {

                res.status(401).json({ statu: 'error', resp: sanitizedResp });

            } else {

                res.status(200).json({ statu: 'success', resp: sanitizedResp });

            }

        })

        .catch(err => {

            res.status(500).json({ error: true, message: { silver: 'Erreur lors de la création du compte', server: err || err.message } });
        
        });

    }

    catch (err) {

        res.status(500).json({ error: true, message: { silver: 'Erreur lors de la création du compte', server: err || err.message } });

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

        await verifyToken(token).then(resp => {

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



module.exports = router;