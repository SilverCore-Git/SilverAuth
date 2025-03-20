/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */

const connection = require('./database.js');
require('dotenv').config();
const AlgoHash = process.env.HASH_ALGO;

class update {

    async Email(oldEmail, password, newEmail) {
        let conn;
        try {
            conn = await connection.getConnection();
            const hashedPassword = require('crypto').createHash(AlgoHash).update(password).digest('hex');
            const [rows] = await conn.query('SELECT password_hash FROM account WHERE email = ?', [oldEmail]);
            
            if (rows.length === 0 || rows[0].password_hash !== hashedPassword) {
                return { error: true, message: 'Mot de passe incorrect.' };
            }
            
            await conn.query('UPDATE account SET email = ? WHERE email = ?', [newEmail, oldEmail]);
            return { message: 'Email mis à jour avec succès.' };
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour de l\'email:', err.message || err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }

    async Pseudo(email, password, newPseudo) {
        let conn;
        try {
            conn = await connection.getConnection();
            const hashedPassword = require('crypto').createHash(AlgoHash).update(password).digest('hex');
            const [rows] = await conn.query('SELECT password_hash FROM account WHERE email = ?', [email]);
            
            if (rows.length === 0 || rows[0].password_hash !== hashedPassword) {
                return { error: true, message: 'Mot de passe incorrect.' };
            }
            
            await conn.query('UPDATE account SET pseudo = ? WHERE email = ?', [newPseudo, email]);
            return { message: 'Pseudo mis à jour avec succès.' };
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour du pseudo:', err.message || err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }

    async Password(email, oldPassword, newPassword) {
        let conn;
        try {
            conn = await connection.getConnection();
            const hashedOldPassword = require('crypto').createHash(AlgoHash).update(oldPassword).digest('hex');
            const [rows] = await conn.query('SELECT password_hash FROM account WHERE email = ?', [email]);
            
            if (rows.length === 0 || rows[0].password_hash !== hashedOldPassword) {
                return { error: true, message: 'Ancien mot de passe incorrect.' };
            }
            
            const hashedNewPassword = require('crypto').createHash(AlgoHash).update(newPassword).digest('hex');
            await conn.query('UPDATE account SET password_hash = ? WHERE email = ?', [hashedNewPassword, email]);
            return { message: 'Mot de passe mis à jour avec succès.' };
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour du mot de passe:', err.message || err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }

}

module.exports = new update();
