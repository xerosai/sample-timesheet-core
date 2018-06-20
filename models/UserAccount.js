/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 18:37
 */

const Sequelize = require('sequelize');
const {sequelize} = require('../db');
const {ValidationHelpers} = require('../helpers');

const UserAccount = sequelize.define('user_account', {
    username: {type: Sequelize.DataTypes.STRING, allowNull: false, unique: true},
    password: {type: Sequelize.DataTypes.STRING, allowNull: false},
    emailAddress: {type: Sequelize.DataTypes.STRING, allowNull: false, validate: {isEmail: true}},
    enabled: {type: Sequelize.DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    authToken: {type: Sequelize.DataTypes.STRING, unique: true},
    streetAddress: {type: Sequelize.DataTypes.STRING(200), allowNull: false},
    phoneNumber: {type: Sequelize.DataTypes.STRING(12)}
}, {
    hooks: {
        beforeCreate: async (userAccount, options) => {
            return userAccount.password = await ValidationHelpers.generatePasswordHash(userAccount.password);
        }
    }
});

UserAccount.sync({}).then(() => {
    console.log('UserAccount Model Sync Ok');
});

module.exports = UserAccount;