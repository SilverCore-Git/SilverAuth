/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


// Importation des bibliothèques
const express = require("express");
const router = express.Router();
const apikey = require('../src/database/apikey');


//   gestion des clé d'api

router.get('/000', async (req, res) => {

    const action = req.query.action

    if (action === 'create_key') {


        const account_id = req.query.accntid;
        const organizationName = req.query.orgaName;
        const domaines = req.body.domaines;
        const redirects = req.body.redirects;

        const today = new Date();
        today.setFullYear(today.getFullYear() + 1);
        const expires_at = today.toISOString();

        try {

            await apikey.create(account_id, organizationName, domaines, redirects, expires_at)

            .then(resp => {

                if (resp.error) {

                    res.status(401).json(resp);

                }
                else {

                    res.status(200).json(resp);

                };

            })

            .catch(err => {

                res.status(500).json( { error: true, message: { silver: 'Une erreur est survenue !', server: err || err.message } } );

            });

        }
        catch (err) {

            res.status(500).json({

                error: true,
                message: {
                    silver: "Une erreur est survenue lors de la création d'une clé d'api.",
                    server: err || err.message
                }

            });

        };

    }


    else {

        res.status(403).json( {
            error: true,
            message: {
                silver: 'Action non valide.',
                use: '/api/000?action='
            }
        } );

    };

})

router.get('/:key', async (req, res) => {

    const action = req.query.action;
    const key = req.params.key;


    if (action === 'info') {

        try {
            
            await apikey.info(key)

            .then(resp => {

                if (resp.error) {

                    res.status(400).json( resp );

                }

                else {

                    res.status(200).json(resp);

                };

            })

            .catch(err => {

                res.status(500).json( { error: true, message: { silver: 'Une erreur est survenue !', server: err || err.message } } );

            });


        }
        catch (err) {

            res.status(500).json({

                error: true,
                message: {
                    silver: "Une erreur est survenue lors de la récuperation des info de la clé d'api.",
                    server: err || err.message
                }

            });

        };

    }

    else if (action === 'remove') {

        try {

            await apikey.delete(key)

            .then(resp => {

                if (resp.error) {

                    res.status(400).json( resp );

                }

                else {

                    res.status(200).json(resp);

                };

            })

            .catch(err => {

                res.status(500).json( { error: true, message: { silver: 'Une erreur est survenue !', server: err || err.message } } );

            });

        }
        catch (err) {

            res.status(500).json({

                error: true,
                message: {
                    silver: "Une erreur est survenue lors de la supression de la clé d'api.",
                    server: err
                }

            });

        };

    }


    else {

        res.status(403).json( {
            error: true,
            message: {
                silver: 'Action non valide.',
                use: '/api/:key?action='
            }
        } );

    };


})




module.exports = router;