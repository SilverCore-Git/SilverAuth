/**
 * @author SilverCore
 * @author SilverAuth
 * @author MisterPapaye
 */


const crypto = require('crypto');



class APIKeyManager {

    constructor() {}

    generateAPIKey() {

        const apiKey = crypto.randomBytes(32).toString('hex');
        const createdAt = new Date();
        this.apiKeys.set(apiKey, { createdAt, revoked: false });
        return apiKey;
        
    }

    isAPIKeyValid(apiKey) {
        const keyData = this.apiKeys.get(apiKey);
        if (!keyData || keyData.revoked) {
        return false;
        }
        return true;
    }

    revokeAPIKey(apiKey) {
        const keyData = this.apiKeys.get(apiKey);
        if (!keyData) {
        return false;
        }
        keyData.revoked = true;
        return true;
    }

    getAPIKeyInfo(apiKey) {
        return this.apiKeys.get(apiKey) || null;
    }

}
