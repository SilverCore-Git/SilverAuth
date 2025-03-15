/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */

const connection = require('./database.js');

class Account {


    async create(
        email, 
        pseudo, 
        password, 
        accountGrade = 'USER', 
        dataplus = null
    ) {

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

            return result;

        } catch (err) {

            console.error('❌ Erreur lors de la création du compte:', err.message || err);
            return { error: true, message: err.message || err };

        } finally {
            if (conn) conn.release();
        }
    }


    async info(email) {

        let conn;
        try {

            // Connexion à la base de données
            conn = await connection.getConnection();

            // Requête pour récupérer les informations du compte par email
            const [rows] = await conn.query(
                'SELECT * FROM account WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return { error: true, message: 'Aucun compte trouvé avec cet email.' };
            }

            return { message: 'Informations récupérées avec succès.', data: rows };

        } catch (err) {
            console.error('❌ Erreur lors de la récupération des informations du compte:', err.message || err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }


    async deleteByEmail(email) {
        let conn;
        try {
            // Connexion à la base de données
            conn = await connection.getConnection();

            // Requête pour supprimer le compte par email
            const result = await conn.query(
                'DELETE FROM account WHERE email = ?',
                [email]
            );

            if (result.affectedRows === 0) {
                throw new Error('Aucun compte trouvé avec cet email pour supprimer.');
            }

            console.log(`✅ Compte avec l'email ${email} supprimé avec succès.`);
            return { message: 'Compte supprimé avec succès.' };

        } catch (err) {
            console.error('❌ Erreur lors de la suppression du compte:', err.message || err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }
}

module.exports = new Account();
