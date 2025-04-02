/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


console.log('Démarrage du serveur...');


// Importation des bibliothèques
const express = require("express");
const http = require("http");
const fs = require("fs");
const cookieParser = require('cookie-parser');
const axios = require('axios');
const config = require('./config.json');

// SSL key & cert path
// const options = { 
//     key: fs.readFileSync(config.SSLkeyPath, "utf8"),
//     cert: fs.readFileSync(config.SSLcertPath, "utf8"),
// };


// importation des roots
const root_api = require('./roots/api.js');
const root_popup = require('./roots/popup.js');
const root_dev = require('./src/devaccess/devroots.js');
const root_auth = require('./roots/auth.js');
const root_user = require('./roots/user.js');
const root_panel = require('./roots/panel.js');
const root_skinapi = require('./roots/skinapi.js');


const roots = {

    "api": root_api,
    "skinapi": root_skinapi,
    "popup": root_popup,
    "auth": root_auth,
    "user": root_user,
    "panel": root_panel,

    "dev": root_dev

};


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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


console.log("Server express démarer !");



app.set("view engine", "ejs");
app.use(express.static("public"));


// roots
app.use('/api', roots.api);
app.use('/api/skin', roots.skinapi);
app.use('/auth', roots.auth);
app.use('/popup', roots.popup);
app.use('/user', roots.user);
app.use('/panel', roots.panel);

app.use('/dev', roots.dev);



app.get('/example/site', (req, res) => {
    res.sendFile(path.join( __dirname, 'public', 'example_site', `index.html` ));
});
app.get('/example/site/callback', (req, res) => {
    res.sendFile(path.join( __dirname, 'public', 'example_site', `callback.html` ));
});

app.get('/favicon.ico', (req, res) => {

    res.redirect('https://api.silverdium.fr/img/auth/favicon.ico');

});

app.get('/assets/:dir/:file', (req, res) => {

    const dir = req.params.dir;
    const file = req.params.file;
    const ext = req.query.ext;

    res.sendFile(path.join( __dirname, 'assets', dir, `${file}.${ext}` ))

});

app.get('/doc', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/doc/index.html'))
})

app.get('/asset/css/btn', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/css/docbtn.css'))
})
app.get('/btn', (req, res) => {
    res.send(`<link rel="stylesheet" href="/asset/css/btn">
<button onclick="silverauthPopup()" class="sauth-login-button">
    <img src="https://api.silverdium.fr/img/auth/logo.png">
    <span>Se connecter avec SilverAuth</span>
</button>`)
})
app.get('/user/:go', (req, res) => {

    const go = req.params.go;

    if (go === 'profile' ) {

        res.sendFile( path.join( __dirname, 'public/panel/user/profile.html' ) );

    } 

    else {
        res.status(404).render('error/404');
    };

});

app.get('/getipV4', async (req, res) => {
    try {
        // Utiliser axios pour obtenir l'IP publique via ipify
        const response = await axios.get("https://api4.ipify.org?format=json");
        const userIp = response.data.ip;  // Récupérer l'IP depuis la réponse

        // Envoyer l'IP de l'utilisateur dans la réponse
        res.json({ ip: userIp });
    } catch (error) {
        // En cas d'erreur, renvoyer un message d'erreur
        res.status(500).json({ error: "Impossible de récupérer l'adresse IP" });
    }
});

// const key = require('./src/database/apikey.js');
// async function d() {
//     await key.GetKeys(27).then(res => console.log(res))
// }
// d()
// return
 


app.use((req, res) => {
    res.status(404).render('error/404');
});

const PORT = 8456;
http.createServer(app).listen(PORT, () => {
    console.log(`Serveur HTTPS en ligne sur localhost:${PORT}`);
});
