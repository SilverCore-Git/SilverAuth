/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


const connection = require('./database.js');
const crypto = require('crypto');

function isObject(variable) {
    return variable !== null && typeof variable === 'object' && !Array.isArray(variable);
}

class APIKeyManager {

    generateAPIKey() {
        return crypto.randomBytes(32).toString('hex');
    }


    async create(

            accountId, 
            organizationName, 
            allowedDomains = null, 
            redirectUrls = null,
            dataplus = null, 
            dailyRequestLimit = 1000,
            expiresAt = null

    ) {

        let conn;
        try {

            
            if (expiresAt instanceof Date && !isNaN(expiresAt)) {
                expiresAt = expiresAt.toISOString();
            }


            if (!expiresAt) {
                expiresAt = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " ");
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
            return { key: apiKey, data: resultApiKey };

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

            return { statu: 'success', data: rows };

        } catch (err) {

            console.error('❌ Erreur lors de la récupération des informations de la clé API:', err.message || err);
            return { error: true, message: err.message || err };

        } finally {

            if (conn) conn.release();

        }
    }


    async GetKeys(userId) {
        
        let conn;
        try {
            // Connexion à la base de données
            conn = await connection.getConnection();
    
            // Requête pour récupérer toutes les clés API pour un utilisateur donné (par son ID)
            const result = await conn.query(
                'SELECT * FROM apikey WHERE account_id = ?',
                [userId]
            );
    
            return result;

            // Vérification si le résultat est un objet
            if (!isObject(result)) {
                return {data: result};
            }
    
            const rows = result[0];  // On accède au tableau de résultats

    
            // Si aucune clé API n'est trouvée pour cet utilisateur
            if (!rows || rows.length === 0) {
                return { error: true, message: 'Aucune clé API trouvée pour cet utilisateur.' };
            }
    
            // Si des clés API sont trouvées, les retourner dans le champ 'data'
            return { status: 'success', data: rows };
    
        } catch (err) {
            // Gestion des erreurs
            console.error('❌ Erreur lors de la récupération des clés API de l\'utilisateur:', err.message || err);
            return { error: true, message: err.message || err };
    
        } finally {
            // Libération de la connexion à la base de données
            if (conn) conn.release();
        }
    }


};

module.exports = new APIKeyManager();
