 /**
  * @author SilverCore
  * @author SilverAuth
  * @author MisterPapaye
  */
 
 
 // Importation des bibliothèques
 const express = require("express");
 const router = express.Router();
 const { createToken } = require('../token.js');
 
 //   gestion des clé d'api
 
 router.get('/token', (req, res) => {
 
    const id = req.query.id;
    const mail = req.query.mail;
    const token = createToken(id, mail);

    res.json({token});
 
 })
 

 router.get('/', (req, res) => {
    res.json({ message: 'dev access'});
 })
 
 
 
 module.exports = router;