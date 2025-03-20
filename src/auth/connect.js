/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */



const account = require('../database/account.js');
const { createToken } = require('../token.js');

require('dotenv').config();
const AlgoHash = process.env.HASH_ALGO;


module.exports = async function AccountConnect(mail, passwd, expiretime = 24) { 

    const hashedPassword = require('crypto').createHash(AlgoHash).update(passwd).digest('hex');

    try {

        const res = await account.info(mail); 

        if (res.error) {
 
            return { 
                error: true, 
                message: { 
                    silver: 'Erreur lors de la connexion !', 
                    server: res.message 
                }
            };

        }

        if (hashedPassword === res.data.password_hash) {

            const token = await createToken(res.data.id, res.data.pseudo, res.data.email, res.data.dataplus)

            return { message: 'Connexion réussie !', token: token, expiretime: expiretime };

        }

        else { 

            return { error: true, type: 405, message: 'Mot de passe incorrect !' };

        };

    } catch (err) {
        return { error: true, type: 405, message: 'invalid credential' };
    }
};
