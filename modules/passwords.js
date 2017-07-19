var crypto = require('crypto');
var db = require('./db.js');

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

function encrypt(input, key) {

        var credentials = {}
        key = key || keyGen();

        var cipher = crypto.createCipher(alg, key);
        var crypted = cipher.update(input, 'utf8', 'hex');
        crypted += cipher.final('hex');
        credentials.key = key;
        credentials.password = crypted;
        return credentials;

}

module.exports = function(db) {


    return {
        encrypt: encrypt,
        decrypt: function(input, key) {

            var decipher = crypto.createDecipher(alg, key)
            var dec = decipher.update(input,'hex','utf8')
            dec += decipher.final('utf8');
            return dec;


        },
        compare: function(data, input) {
            /* Accepts two paramaters: Database Result and User Input  */
            var creds = this.encrypt(input, data.key);
            return creds.password == data.hash;

        },

        requireAuth: function(req, res, next) {
            var token = req.get('Auth') || 'null';
            var tokenHash = encrypt(token, token);

            db.token.findOne({where: {
                hash: tokenHash.password
            }}).then(function(resp){

                if (!resp) {

                    throw new Error();

                }
                req.token = resp;
                return db.user.findByToken(token);

            }).then(function(user){

                req.user = user;
                next();

            }).catch(function(err){

                res.status(401).send();

            });

        }

    }
}