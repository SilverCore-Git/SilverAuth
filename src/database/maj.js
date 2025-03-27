/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */

const connection = require('./database.js');
require('dotenv').config();
const crypto = require('crypto');

const AlgoHash = process.env.HASH_ALGO;

class Update {

    async Email(oldEmail, password, newEmail) {
        let conn;
        try {
            conn = await connection.getConnection();
            const hashedPassword = crypto.createHash(AlgoHash).update(password).digest('hex');
            
            const [rows] = await conn.query('SELECT password_hash FROM account WHERE email = ?', [oldEmail]);
            if (!rows.length || rows[0].password_hash !== hashedPassword) {
                return { error: true, message: "Mot de passe incorrect ou compte introuvable." };
            }
    
            await conn.query('UPDATE account SET email = ? WHERE email = ?', [newEmail, oldEmail]);
            return { message: "Email mis à jour avec succès." };
        } catch (err) {
            console.error("❌ Erreur lors de la mise à jour de l'email:", err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }

    async Pseudo(email, password, newPseudo) {
        let conn;
        try {
            conn = await connection.getConnection();
            const hashedPassword = crypto.createHash(AlgoHash).update(password).digest('hex');
    
            const [rows] = await conn.query('SELECT pseudo, password_hash FROM account WHERE email = ?', [email]);
            if (!rows.length || rows[0].password_hash !== hashedPassword) {
                return { error: true, message: 'Mot de passe incorrect ou utilisateur introuvable.' };
            }
    
            if (rows[0].pseudo === newPseudo) {
                return { error: true, message: 'Ce pseudo est déjà votre pseudo actuel.' };
            }
    
            await conn.query('UPDATE account SET pseudo = ? WHERE email = ?', [newPseudo, email]);
            return { message: 'Pseudo mis à jour avec succès.' };
        } catch (err) {
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }

    async Password(email, oldPassword, newPassword) {
        let conn;
        try {
            conn = await connection.getConnection();
            const hashedOldPassword = crypto.createHash(AlgoHash).update(oldPassword).digest('hex');

            const [rows] = await conn.query('SELECT password_hash FROM account WHERE email = ?', [email]);
            if (!rows.length || rows[0].password_hash !== hashedOldPassword) {
                return { error: true, message: 'Ancien mot de passe incorrect.' };
            }

            const hashedNewPassword = crypto.createHash(AlgoHash).update(newPassword).digest('hex');
            await conn.query('UPDATE account SET password_hash = ? WHERE email = ?', [hashedNewPassword, email]);
            return { message: 'Mot de passe mis à jour avec succès.' };
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour du mot de passe:', err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }

    async PasswordForAdmin(email, newPassword) {

        let conn;

        try {

            conn = await connection.getConnection();

            const hashedNewPassword = crypto.createHash(AlgoHash).update(newPassword).digest('hex');
            await conn.query('UPDATE account SET password_hash = ? WHERE email = ?', [hashedNewPassword, email]);
            return { message: 'Mot de passe mis à jour avec succès.' };
            
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour du mot de passe:', err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }

    }

    async Note(email, newNote) {

        let conn;
        try {
            conn = await connection.getConnection();
    

            // if (!rows[0]) {
            //     return { error: true, message: 'Utilisateur introuvable.' };
            // }
    

    
            await conn.query('UPDATE account SET note = ? WHERE email = ?', [newNote, email]);
    
            return { message: 'Note mise à jour avec succès.' };
    
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour de la note:', err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }

    }
    

    async Role(email, newRole) {

        let conn;
        try {
            conn = await connection.getConnection();
    

            // if (!rows[0]) {
            //     return { error: true, message: 'Utilisateur introuvable.' };
            // }
    

            await conn.query('UPDATE account SET account_grade = ? WHERE email = ?', [newRole, email]);
    
            return { message: 'Rôle mis à jour avec succès.' };
    
        } catch (err) {
            console.error('❌ Erreur lors de la mise à jour du rôle:', err);
            return { error: true, message: err.message || err };
        } finally {
            if (conn) conn.release();
        }
    }
    
}

module.exports = new Update();
