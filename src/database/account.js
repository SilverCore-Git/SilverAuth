/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */

const connection = require('./database.js');

class Account {

    /**
     * Crée un compte dans la base de données
     * @param {string} email - L'email de l'utilisateur
     * @param {string} pseudo - Le pseudo de l'utilisateur
     * @param {string} password - Le mot de passe (en texte brut)
     * @param {string} accountGrade - Le grade de l'utilisateur (par défaut 'USER')
     * @param {Object} dataplus - Des informations supplémentaires en format JSON
     * @returns {Promise<Object>} - Résultat de l'opération d'insertion
     */
    async create(email, pseudo, password, accountGrade = 'USER', dataplus = null) {

        let conn;
        try {
            // Connexion à la base de données
            conn = await connection.getConnection();

            // Hachage du mot de passe pour sécurité
            const hashedPassword = require('crypto').createHash('sha256').update(password).digest('hex');

            // Insertion du compte dans la base de données
            const result = await conn.query(
                'INSERT INTO account (email, pseudo, password_hash, account_grade, dataplus) VALUES (?, ?, ?, ?, ?)', 
                [email, pseudo, hashedPassword, accountGrade, JSON.stringify(dataplus)]
            );

            console.log('✅ Compte créé avec succès !');
            return result;

        } catch (err) {
            console.error('❌ Erreur lors de la création du compte:', err.message || err);
            throw new Error('Erreur lors de la création du compte. Veuillez réessayer.');

        } finally {
            // Libération de la connexion
            if (conn) conn.release();
        }
    }
}

module.exports = new Account();
