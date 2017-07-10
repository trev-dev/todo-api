var crypto = require('crypto');

var alg = 'aes-256-ctr';

function keyGen() {
    var len = 24;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*.-_';
    var string = '';

    for (var i = 0; i < len; i++) {
        
        let key = Math.floor(Math.random() * chars.length);
        string += chars[key];
        
    }

    return string;

}

module.exports = {

    encrypt: function(input, key) {
        // Generates a credentials object using a user input and a key. If no key is provided, one is generated.
        var credentials = {}
        key = key || keyGen();

        var cipher = crypto.createCipher(alg, key);
        var crypted = cipher.update(input, 'utf8', 'hex');
        crypted += cipher.final('hex');
        credentials.key = key;
        credentials.password = crypted;
        return credentials;

    },
    compare: function(data, input) {
        /* Accepts two paramaters: Database Result and User Input  */
        var creds = this.encrypt(input, data.key);
        return creds.password == data.hash;

    }

}