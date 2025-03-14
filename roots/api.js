/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


// Importation des bibliothèques
const express = require("express");
const router = express.Router();


//   gestion des clé d'api

router.get('/000', (req, res) => {

    const action = req.query.action

    if (action === 'create_key') {

        try {

            // awate création de la clé avec promesse code 200

        }
        catch (err) {

            res.status(500).json({

                error: true,
                message: {
                    silver: "Une erreur est survenue lors de la création d'une clé d'api.",
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
                use: '/api/000?action='
            }
        } );

    };

})

router.get('/:key', (req, res) => {

    const action = req.query.action


    if (action === 'info') {

        try {
            
            // awate get info de la clé avec promesse code 200

        }
        catch (err) {

            res.status(500).json({

                error: true,
                message: {
                    silver: "Une erreur est survenue lors de la récuperation des info de la clé d'api.",
                    server: err
                }

            });

        };

    }

    else if (action === 'remove') {

        try {

            // awate remove key avec promesse code 200

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