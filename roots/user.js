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




router.get('/', (req, res) => {
    res.redirect('/user/profile');
});


router.get('/profile', (req, res) => {

    if (req.query.dev === "1") {
        res.status(200).render('profile', { name: 'name', email: 'email@email.com', creatat: 'date de création' });
        return
    }
    res.render('profile')

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

    if (!req.file) {
        return res.status(400).json({ error: true, message: 'Aucun fichier envoyé' });
    }


    const token = req.cookies.silvertoken;
    const name = req.query.name;
    const tempFile = req.file.path;
    const defFile = `../data/pp/all/${name}.png`;

    try {

        await verifyToken(token).then(resp, async () => {

            if (resp.valid === true) {

                if (resp.data.usr_info.name === name) {

                    await fs.defFile(defFile);
                    await fs.copyFileSync(tempFile, defFile);
                    await fs.defFile(tempFile);

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

        return res.status(401).json({ error: true, message: { silver: 'Erreur lors de la vérification de la session !', server: err || err.message }});

    };


});


router.post('/maj/email', async (req, res) => {

    const mail = req.body
    const token = req.cookies.silvertoken;

    try {

        await verifyToken(token).then(resp, async () => {

            if (resp.valid === true) {

                if (resp.data.usr_info.email === mail) {



                } else {
                    return res.status(401).json({ error: true, message: {silver: "Email incorect." } });
                }
                

            }

            else {
                return res.status(401).json({ error: true, message: {silver: 'Session invalid.'} });
            };

        });

    }

    catch (err) {

        return res.status(401).json({ error: true, message: { silver: 'Erreur lors de la vérification de la session !', server: err || err.message }});

    };


});


module.exports = router;