module.exports = function(sql, DataTypes) {

    return sql.define('todo', {

        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [4, 250]
            }
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false

        }

    });

};
