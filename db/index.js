/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 17:52
 * @description Implement connection to database
 */

const Sequelize = require('sequelize');
const {DATABASE_CONFIG} = require('../config');

module.exports.sequelize = new Sequelize(`${DATABASE_CONFIG.DIALECT}://${DATABASE_CONFIG.USERNAME}:${DATABASE_CONFIG.PASSWORD}@localhost:3306/${DATABASE_CONFIG.DATABASE}`);

module.exports.dbConnect = async () => {
    const connectionResult = {success: undefined, error: undefined};
    try {
        await this.sequelize.authenticate();
        connectionResult.success = true;
        return connectionResult;
    } catch (e) {
        connectionResult.success = false;
        connectionResult.error = e.toString();
        return connectionResult;
    }
};
