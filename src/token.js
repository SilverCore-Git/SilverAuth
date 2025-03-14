/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


const jwt = require('jsonwebtoken');
require('dotenv').config();

var key = process.env.TOKEN_SECRET_KEY;


function createToken(userID, mail, expiretime = 1) {

    const payload = {
        userId: userID,
        email: mail
    };

    const options = {
        expiresIn: `${expiretime}h`,
        subject: `user_${userID}`
    };

    const token = jwt.sign(payload, key, options);

};


module.exports = { createToken }