/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 20 2018 @ 00:32
 */

const Sequelize = require('sequelize');
const {sequelize} = require('../db');

const Client = sequelize.define('client', {
    clientName: {type: Sequelize.DataTypes.STRING, allowNull: false},
    companyName: {type: Sequelize.DataTypes.STRING},
    manager: {type: Sequelize.DataTypes.STRING, allowNull: false},
    mainPhone: {type: Sequelize.DataTypes.STRING(12)},
    streetAddress: {type: Sequelize.DataTypes.STRING}
});

Client.sync({}).then(() => {
    console.log('Client Model Sync Ok');
});

module.exports = Client;