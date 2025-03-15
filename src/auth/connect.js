/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


const account = require('../database/account.js');
const { createToken } = require('../token.js');


module.exports = async function AccountConnect(mail, passwd) {

    const hashedPassword = require('crypto').createHash('sha256').update(passwd).digest('hex');

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

            const token = await createToken(res.data.id, res.data.email)

            return { message: 'Connexion réussie !', token: token };
        }

        return { error: true, message: 'Mot de passe incorrect !' };

    } catch (err) {
        return { error: true, message: err.message || err };
    }
};
