/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


const jwt = require('jsonwebtoken');
require('dotenv').config();

var key = process.env.TOKEN_SECRET_KEY;

class token {


    async create(userID, name, mail, createat, dataplus, account_grade, expiretime = 7*24) {

        const payload = {

            JWTExpireAt: expiretime,

            usr_info: {

                userId: userID,
                createat: createat,
                name: name,
                email: mail,
                account_grade: account_grade,
                dataplus: dataplus,

                pp: `${dataplus.url.pp}/${name}`,

                skin: {
                    head: `${dataplus.url.skin.head}/${name}`,
                    head: `${dataplus.url.skin.skin}/${name}`
                }

            }

        };
    
        const options = {
            expiresIn: `${expiretime}h`,
            subject: `user_${userID}`
        };
    
        const token = await jwt.sign(payload, key, options);
    
        return token
    
    };
    
    async verify(token) {
    
        try {
    
            const decoded = await jwt.verify(token, key);
    
            return { valid: true, token: token, data: decoded };
    
        } catch (error) {
    
            return { error: true, valid: false, message: 'Token invalide ou expiré' };
    
        }
    
    };


};






module.exports = new token();