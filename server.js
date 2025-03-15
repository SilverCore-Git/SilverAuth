/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */



console.log('Démarrage du serveur...');


// Importation des bibliothèques
const express = require("express");
const http = require("http");
const ejs = require("ejs");
const cookieParser = require('cookie-parser');



// importation des roots
const root_api = require('./roots/api.js');
const root_popup = require('./roots/popup.js');
const root_dev = require('./src/devaccess/devroots.js')
const root_auth = require('./roots/auth.js')

const roots = {

    "api": root_api,
    "popup": root_popup,
    "auth": root_auth,

    "dev": root_dev

}


// gestion des databases
const connection = require('./src/database/database.js');
const path = require("path");

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
app.use(cookieParser());


console.log("Server express démarer !");



app.set("view engine", "ejs");
app.use(express.static("public"));


// roots
app.use('/api', roots.api);
app.use('/auth', roots.auth);
app.use('/popup', roots.popup);

app.use('/dev', roots.dev);


app.get('/assets/:dir/:file', (req, res) => {

    const dir = req.params.dir;
    const file = req.params.file;
    const ext = req.query.ext;

    res.sendFile(path.join( __dirname, 'assets', dir, `${file}.${ext}` ))

});


app.get('/test', (req, res) => {
    res.render('login')
})

const PORT = 8456;
http.createServer(app).listen(PORT, () => {
    console.log(`Serveur HTTPS en ligne sur localhost:${PORT}`);
});
