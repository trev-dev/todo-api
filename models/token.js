var crypt = require('../modules/passwords.js')();

module.exports = function(sql, DataTypes){

    return sql.define('token', {

        token: {

            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                len: [1]
            },
            set: function(value){

                var creds = crypt.encrypt(value, value);
                this.setDataValue('token', value);
                this.setDataValue('hash', creds.password);
            }

        }, 
        hash: {
            type: DataTypes.STRING(1999),
            allowNull: false
        }

    });

};