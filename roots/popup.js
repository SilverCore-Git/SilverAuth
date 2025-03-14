/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


// Importation des bibliothèques
const express = require("express");
const router = express.Router();



// ex d'utilisation :
router.get('/auth', (req, res) => { 

    const apiKey = req.headers['APIKey']    // recupération de la clé d'api stocké dans le head de la raquete
    const action = req.query.action         // ?action= peut être login register...
    const redirect = req.query.redirect     // ?redirect= est l'url vers laquelle l'utilisateur va être rediriger





})



module.exports = router;