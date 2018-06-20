/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 20 2018 @ 00:15
 */

const Sequelize = require('sequelize');
const {sequelize} = require('../db');
const Client = require('./Client');
const UserAccount = require('./UserAccount');

const TimesheetEntry = sequelize.define('timesheet_entry', {
    startDate: {type: Sequelize.DataTypes.DATE, allowNull: false},
    endDate: {type: Sequelize.DataTypes.DATE, allowNull: false},
    overtime: {type: Sequelize.DataTypes.INTEGER, defaultValue: 0},
    jobTitle: {type: Sequelize.DataTypes.STRING, allowNull: false},
    comments: {type: Sequelize.DataTypes.TEXT('long'), allowNull: false}
}, {
    hooks: {
        beforeSave: (timesheetEntry, options) => {

        }
    }
});

TimesheetEntry.belongsTo(UserAccount);
TimesheetEntry.belongsTo(Client);

TimesheetEntry.sync({}).then(() => {
    console.log('TimesheetEntry Sync Ok');
});

module.exports = TimesheetEntry;