/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


const jwt = require('jsonwebtoken');
require('dotenv').config();

var key = process.env.TOKEN_SECRET_KEY;



async function createToken(userID, name, mail, dataplus, expiretime = 24) {

    const payload = {
        expiretime: expiretime,
        usr_info: {
            userId: userID,
            name: name,
            email: mail,
            dataplus: dataplus
        }
    };

    const options = {
        expiresIn: `${expiretime}h`,
        subject: `user_${userID}`
    };

    const token = await jwt.sign(payload, key, options);

    return token

};

async function verifyToken(token) {

    try {

        const decoded = await jwt.verify(token, key);

        return { valid: true, token: token, data: decoded };

    } catch (error) {

        return { error: true, valid: false, message: 'Token invalide ou expiré' };

    }

}




module.exports = { createToken, verifyToken }