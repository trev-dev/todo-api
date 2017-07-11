var crypt = require('../modules/passwords.js');
var _ = require('underscore');
var jwt = require('jsonwebtoken');

module.exports = function(sql, DataTypes) {

    var user = sql.define('user', {

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        key: {

            type: DataTypes.STRING

        },
        hash: {

            type: DataTypes.STRING

        },

        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [7-250]
            },
            set: function(value){
                var creds = crypt.encrypt(value);
                this.setDataValue('password', value);
                this.setDataValue('key', creds.key);
                this.setDataValue('hash', creds.password);
            }
        }


    });

    user.prototype.publicJSON = function() {
        
        return _.pick(this, 'email', 'id');

    };

    user.prototype.generateToken = function(type) {

        if (!type) {

            return undefined;

        }

        try {

            var cryptString = crypt.encrypt(JSON.stringify({id: this.id, type: type}), type);
            
            var token = jwt.sign({
                token: cryptString
            }, 'SnickerD00dle3');

            return token;

        } catch (e) {

            return undefined;

        }

    };

    user.auth = function(body) {

        return new Promise(function(resolve, reject) {

            if (!body.email || !body.password) {

                return reject();

            } else {

                user.findOne({where: {

                    email: body.email

                }}).then(function(resp){

                    if (resp) {

                        if (crypt.compare(resp, body.password)) {
                            resolve(resp);

                        } else {

                            reject();

                        }

                    } else {

                        reject();

                    }

                }).catch(function(error){

                    reject();

                });

            }

        });

    };

    return user;

};