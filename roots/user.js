/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
*/


// packages
const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// require
const update = require('../src/database/maj.js');
const account = require('../src/database/account.js');
const config = require('../config.json');
const Token = require('../src/token.js');


router.get('/', (req, res) => {
    res.redirect('/user/profile');
});


router.get('/profile', async (req, res) => {

    const token = req.cookies.silvertoken;


    if (req.query.dev === "1") {
        res.status(200).render('profile', { name: 'name', email: 'email@email.com', creatat: 'date de création', ppimg: '/api/skin/view/pp/default', uuid: 'anbe434c-v7f2-4932-b32c-984a789d79b4' });
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

            res.render('profile', {
                name: resp.data.usr_info.name,
                email: resp.data.usr_info.email,
                creatat: formattedDate, 
                ppimg: `/api/skin/view/pp/${resp.data.usr_info.name}`,
                uuid: resp.data.usr_info.dataplus.UUID
            })

        }

        else {
            res.redirect('/auth/view/login?redirect=/user/profile')
        }

    })

});


router.get('/delete/my/beautiful/silveraccount', (req, res) => {

    res.render('deletemyaccount');

});

router.get('/delete/my/beautiful/silveraccount/del', async (req, res) => {

    const email = req.query.email;
    const token = req.cookies.silvertoken;

    await Token.verify(token).then(async resp => {

        if (resp.valid) {

            if (resp.data.usr_info.email === email) {

                await account.deleteByEmail(email).then(resp2 => {

                    if (resp2.error) {
                        return res.status(500).json({ error: true, message: { silver: 'Une erreur est survenue.' } })
                    }
                    else {
                        fs.unlinkSync(`data/pp/all/${resp.data.usr_info.name}.png`)
                        fs.unlinkSync(`data/skinapi/head/${resp.data.usr_info.name}.png`)
                        fs.unlinkSync(`data/skinapi/skin/${resp.data.usr_info.name}.png`)
                        return res.status(200).json({ success: true, message: { silver: 'Compte suprimer avec succès' } });
                    }

                })

            } 

            else if (resp.data.usr_info.dataplus.role === 'ADMIN') {

                await account.deleteByEmail(email).then(resp2 => {

                    if (resp2.error) {
                        return res.status(500).json({ error: true, message: { silver: 'Une erreur est survenue.' } })
                    }
                    else {
                        fs.unlinkSync(`data/pp/all/${resp.data.usr_info.name}.png`)
                        fs.unlinkSync(`data/skinapi/head/${resp.data.usr_info.name}.png`)
                        fs.unlinkSync(`data/skinapi/skin/${resp.data.usr_info.name}.png`)
                        return res.status(200).json({ success: true, message: { silver: 'Compte suprimer avec succès' } });
                    }

                })

            }

            else {
                return res.status(400).json({error: true, message: { silver: 'Email invalid' }});
            };

        } else {
            res.redirect('/auth/view/login');
        };

    })


    res.render('deletemyaccount');

});



// Configuration de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'temp/'); // Dossier où stocker les fichiers
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

//  for maj

router.post('/maj/pp', upload.single('file'), async (req, res) => {

    if (req.hostname === config.hostname) {
        

        if (!req.file) {
            return res.status(400).json({ error: true, message: 'Aucun fichier envoyé' });
        }


        const token = req.cookies.silvertoken;
        const name = req.query.name;
        const tempFile = req.file.path;
        const defFile = `data/pp/all/${name}.png`;

        try {

            await Token.verify(token).then(async (resp) => {

                if (resp.valid === true) {

                    if (resp.data.usr_info.name === name) {

                        await fs.unlinkSync(defFile);
                        await fs.copyFileSync(tempFile, defFile);
                        await fs.unlinkSync(tempFile);

                        res.status(200).json({ ok: true, message: { silver: 'Photo mise a jours !' } })

                    } else {
                        return res.status(401).json({ error: true, message: {silver: "Nom d'utilisateur incorect." } });
                    }
                    

                }

                else {
                    return res.status(401).json({ error: true, message: {silver: 'Session invalid.'} });
                };

            });

        }

        catch (err) {

            return res.status(500).json({ error: true, message: { silver: 'Une erreur est survenue', server: err || err.message }});

        };

    }

    else {
        res.status(400).json( { error: true, message: 'Requête seulement accesible par silverauth !' } );
    };

});


router.post('/maj/email', async (req, res) => {


    if (req.hostname === config.hostname) {

        const { passwd, oldEmail, newEmail } = req.body;
        const token = req.cookies.silvertoken;

        try {

            await Token.verify(token).then(async (resp) => {

                if (resp.valid === true) {

                    await update.Email(oldEmail, passwd, newEmail).then(resp => {

                        if (resp.error) {
                            return res.status(500).json({ error: true, step: 2, message: { silver: 'Une erreur est survenue, reessayer plus tard.', server: resp.message } });
                        } else {
                            return res.status(200).json( { resp } );
                        };

                    })
                    .catch(err => {
                        return res.status(500).json( { error: true, step: 1, message: { silver: 'Une erreur est survenue, reessayer plus tard.', server: err || err.message } } );
                    })

                }

                else {
                    return res.status(401).json({ error: true, message: {silver: 'Session invalid.'} });
                };

            });

        }

        catch (err) {

            return res.status(500).json({ error: true, message: { silver: 'Erreur lors de la vérification de la session !', server: err || err.message }});

        };

    }

    else {
        res.status(400).json( { error: true, message: 'Requête seulement accesible par silverauth !' } );
    };

});


router.post('/maj/pseudo', async (req, res) => {

    if (req.hostname === config.hostname) {

        const { email, passwd, newName } = req.body;
        const OldName = req.query.name;
        const token = req.cookies.silvertoken;

        try {
            const resToken = await Token.verify(token);
        
            if (resToken.valid === true) {
                try {
                    const resp = await update.Pseudo(email, passwd, newName);
        
                    if (resp.error) {
                        if (resp.message.includes('Duplicate entry')) {
                            return res.status(400).json({
                                error: true,
                                step: 2.5,
                                message: { silver: 'Ce pseudo est déjà utilisé. Veuillez en choisir un autre.' }
                            });
                        }
        
                        return res.status(500).json({
                            error: true,
                            step: 2,
                            message: { silver: 'Une erreur est survenue, réessayez plus tard.', server: resp.message }
                        });
                    } else {

                        const OldNamepp = `data/pp/all/${OldName}.png`;
                        const NewNamepp = `data/pp/all/${newName}.png`;
                        fs.promises.rename(OldNamepp, NewNamepp);

                        const OldNamehead = `data/skinapi/head/${OldName}.png`;
                        const NewNamehead = `data/skinapi/head/${newName}.png`;
                        fs.promises.rename(OldNamehead, NewNamehead);

                        const OldNameskin = `data/skinapi/skin/${OldName}.png`;
                        const NewNameskin = `data/skinapi/skin/${newName}.png`;
                        fs.promises.rename(OldNameskin, NewNameskin);

                        return res.status(200).json({ resp });
                    
                    }
                } catch (err) {

                    return res.status(500).json({
                        error: true,
                        step: 1,
                        message: { silver: 'Une erreur est survenue, réessayez plus tard.', server: err.message || err }
                    });
                }
            } else {
                return res.status(401).json({
                    error: true,
                    message: { silver: 'Session invalide.' }
                });
            }

        } catch (err) {
            return res.status(500).json({
                error: true,
                message: { silver: 'Une erreur est survenue !', server: err.message || err }
            });
        }

    }

    else {
        res.status(400).json( { error: true, message: 'Requête seulement accesible par silverauth !' } );
    };

});



router.post('/maj/passwd', async (req, res) => {

    if (req.hostname === config.hostname) {

        const { email, oldPassword, newPassword } = req.body;
        const token = req.cookies.silvertoken;

        try {

            await Token.verify(token).then(async (resp) => { 

                if (resp.valid === true) {

                    await update.Password(email, oldPassword, newPassword).then(resp => {

                        if (resp.error) {
                            return res.status(500).json({ error: true, step: 2, message: { silver: 'Une erreur est survenue, reessayer plus tard.', server: resp.message } });
                        } else {
                            return res.status(200).json( { resp } );
                        };

                    })
                    .catch(err => {
                        return res.status(500).json( { error: true, step: 1, message: { silver: 'Une erreur est survenue, reessayer plus tard.', server: err || err.message } } );
                    })

                }

                else {
                    return res.status(401).json({ error: true, message: {silver: 'Session invalid.'} });
                };

            });

        }

        catch (err) {

            return res.status(500).json({ error: true, message: { silver: 'Erreur lors de la vérification de la session !', server: err || err.message }});

        };

    }

    else {
        res.status(400).json( { error: true, message: 'Requête seulement accesible par silverauth !' } );
    };

});


module.exports = router;