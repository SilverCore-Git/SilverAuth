/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


const { error } = require('console');
const connection = require('./database.js');
const crypto = require('crypto');

class APIKeyManager {

    generateAPIKey() {
        return crypto.randomBytes(32).toString('hex');
    }


    async create(

            accountId, 
            organizationName, 
            dailyRequestLimit = 1000, 
            allowedDomains = null, 
            redirectUrls = null, 
            dataplus = null, 
            expiresAt = null

    ) {

        let conn;
        try {

            
            if (expiresAt instanceof Date && !isNaN(expiresAt)) {
                expiresAt = expiresAt.toISOString();
            }


            if (!expiresAt) {
                const date = new Date();
                date.setFullYear(date.getFullYear() + 1); // Ajouter un an
                expiresAt = date.toISOString();
            }

            // Connexion à la base de données
            conn = await connection.getConnection();

            // Génération de la clé API
            const apiKey = this.generateAPIKey();


            // Insertion dans la table apikey
            const resultApiKey = await conn.query(

                'INSERT INTO apikey (api_key, created_at, expires_at, daily_request_limit, allowed_domains, redirect_urls, organization_name, dataplus, account_id) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?, ?)',
                [
                    apiKey, 
                    expiresAt, 
                    dailyRequestLimit, 
                    JSON.stringify(allowedDomains), 
                    JSON.stringify(redirectUrls), 
                    organizationName, 
                    JSON.stringify(dataplus), 
                    accountId
                ]

            );

            console.log('✅ Clé API créés avec succès !');
            return { apiKey, resultApiKey };

        } catch (err) {

            console.error('❌ Erreur lors de la création de la clé API:', err.message || err);
            return { error: true, message: err.message || err };

        } finally {

            if (conn) conn.release();

        }

    }


    async delete(apiKey) {

        let conn;
        try {

            // Connexion à la base de données
            conn = await connection.getConnection();

            // Suppression de la clé API
            const result = await conn.query(
                'DELETE FROM apikey WHERE api_key = ?',
                [apiKey]
            );

            if (result.affectedRows === 0) {
                return { error: true, message: 'Aucune clé API trouvée à supprimer.' }
            }

            console.log(`✅ Clé API ${apiKey} supprimée avec succès.`);
            return { message: `Clé API ${apiKey} supprimée avec succès.`, affectedRows: result.affectedRows };

        } catch (err) {

            console.error('❌ Erreur lors de la suppression de la clé API:', err.message || err);
            return { error: true, message: err.message || err };

        } finally {

            if (conn) conn.release();

        }
    }


    async info(apiKey) {

        let conn;
        try {

            // Connexion à la base de données
            conn = await connection.getConnection();

            // Requête pour récupérer les informations de la clé API
            const [rows] = await conn.query(
                'SELECT * FROM apikey WHERE api_key = ?',
                [apiKey]
            );

            if (rows.length === 0) {
                return { error: true, message: 'Aucune clé API trouvée.' }
            }

            return { statu: 'success', data: rows[0] };

        } catch (err) {

            console.error('❌ Erreur lors de la récupération des informations de la clé API:', err.message || err);
            return { error: true, message: err.message || err };

        } finally {

            if (conn) conn.release();

        }
    }


};

module.exports = new APIKeyManager();
