/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */

const APIKey = require('./database/apikey.js');

class APIKeyManager {
    
    constructor() {}

    async verify(apiKey) {

        try {

            const resp = await APIKey.info(apiKey);

            if (resp.statu === 'success') {
                return { valid: true, data: resp };
            }

            if (resp.error) {
                return { error: true, message: resp.message }; 
            }

            return { valid: false, message: 'Key non valide', data: resp };

        } catch (err) {

            return { error: true, message: err.message || err };

        }

    }
}

module.exports = new APIKeyManager();
