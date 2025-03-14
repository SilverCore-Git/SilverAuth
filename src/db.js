/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */



const mariadb = require('mariadb');
require('dotenv').config();


const db = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWD,
    database: process.env.DB_DATABASE,
    connectionLimit: 50,
    acquireTimeout: 10000, 
    idleTimeout: 5000 
});

db.getConnection()
    .then(conn => {
        console.log('✅ Connecté à MariaDB avec succès !');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Erreur de connexion à MariaDB:', err.message);
    });

module.exports = db;

