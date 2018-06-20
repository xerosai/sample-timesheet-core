/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 23:30
 */

const ClientsRouter = require('./Clients');
const TimesheetEntriesRouter = require('./TimesheetEntries');
const UserAccountsRouter = require('./UserAccounts');

/**
 * @description Application Router
 * */
module.exports = (app, basePath='/api/v1') => {
    app.use(`${basePath}/clients`, ClientsRouter);
    app.use(`${basePath}/timesheets`, TimesheetEntriesRouter);
    app.use(`${basePath}/accounts`, UserAccountsRouter);
};
