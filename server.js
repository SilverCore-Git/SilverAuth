/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */



console.log('Démarrage du serveur...');


// Importation des bibliothèques
const express = require("express");
const http = require("http");



const account = require('./src/database/account.js');
const apikey = require('./src/database/apikey.js');
const { createToken } = require('./src/token.js');




// importation des roots
const root_api = require('./roots/api.js');
const root_popup = require('./roots/popup.js');
const root_dev = require('./src/devaccess/devroots.js')

const roots = {

    "api": root_api,
    "popup": root_popup,

    "dev": root_dev

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

app.use('/dev', roots.dev);


console.log("Server express démarer !");


const AccountConnect = require('./src/auth/connect.js');

async function d() {
    const result = await AccountConnect('t@t.t', 'tt');
    return result
}

d().then(console.log);






const PORT = 8456;
http.createServer(app).listen(PORT, () => {
    console.log(`Serveur HTTPS en ligne sur localhost:${PORT}`);
});
