/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */



console.log('Démarrage du serveur...');


// Importation des bibliothèques
const express = require("express");
const http = require("http");


// importation de la class compte
const account = require('./src/database/account.js');

account.create('test@test.test', 'caca', 'monpasswd', accountGrade = 'USER', dataplus = null)

// importation des roots
const root_api = require('./roots/api.js');
const root_popup = require('./roots/popup.js');

const roots = {

    "api": root_api,
    "popup": root_popup

}

// gestion des databases
const connection = require('./src/database/database.js');

connection.query('SELECT 1 + 1 AS test', (err, results) => {
    if (err) {
        console.error('❌ Erreur de requête test:', err);
        return;
    }
    console.log('✅ Test réussi, résultat:', results);
});



// divers var 
// const DB_FILE = config.db.DefaultFile;
// const KEY_DB_FILE = config.db.KeyFile;


// initialisation de express

const app = express();

app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use('/api', roots.api);
app.use('/popup', roots.popup);


console.log("Server express démarer !");









const PORT = 8456;
http.createServer(app).listen(PORT, () => {
    console.log(`Serveur HTTPS en ligne sur localhost:${PORT}`);
});
