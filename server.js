/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */



console.log('Démarrage du serveur...');


// Importation des bibliothèques
const express = require("express");
const http = require("http");


// divers var 
const DB_FILE = config.db.DefaultFile;
const KEY_DB_FILE = config.db.KeyFile;


// initialisation de express
const app = express();
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));


console.log("Server express démarer !");









const PORT = 8456;
http.createServer(app).listen(PORT, () => {
    console.log(`Serveur HTTPS en ligne sur localhost:${PORT}`);
});
