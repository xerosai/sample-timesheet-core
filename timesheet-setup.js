/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 21:48
 * Sets up initial database config
 */

const Sequelize = require('sequelize');
const {dbConnect} = require('./db');
const {ValidationHelpers} = require('./helpers');
const ClientModel = require('./models/Client');
const UserAccountModel = require('./models/UserAccount');
const TimesheetEntryModel = require('./models/TimesheetEntry');

const USER_DATA = [
    {
        username: 'simon.neufville',
        password: 'abcd1234',
        enabled: true,
        emailAddress: 'simon@xrscodeworks.com',
        streetAddress: '123 Some Road',
        phoneNumber: '876-555-1234'
    },
    {
        username: 'jane.doe',
        password: 'janedoe123',
        enabled: true,
        emailAddress: 'jane.doe@xrscodeworks.com',
        streetAddress: 'Nowhere Street',
        phoneNumber: '876-555-3421'
    }
];

const CLIENT_DATA = [
    {
        clientName: 'Acme Insurance Co',
        companyName: 'Acme Insurance Co',
        manager: 'Wiley Coyote',
        mainPhone: '876-555-2666',
        streetAddress: '5 Dynamite Drive'
    },
    {
        clientName: 'Host Local',
        companyName: 'Host Local',
        manager: 'Super User',
        mainPhone: '127-001-8080',
        streetAddress: '127.0.0.1'
    },
    {
        clientName: 'Bruce Wayne',
        companyName: 'Wayne Enterprises',
        manager: 'Bruce Wayne',
        mainPhone: '300-003-4568',
        streetAddress: 'Somewhere in Gotham'
    }
];

/**
 * */
const timesheetSetup = async () => {
    try {
        console.log('Preparing to setup database...');

        const connectionResult = await dbConnect();

        if (!connectionResult.success) {
            console.log(`Failed to connect to database with error: ${connectionResult.error}`);
            return;
        }

        console.log('Connected to database');

        console.log('Dropping table contents...');

        await TimesheetEntryModel.destroy({
            where: {},
            truncate: false
        });

        await UserAccountModel.destroy({
            where: {},
            truncate: false
        });

        for (const userObj of USER_DATA) {
            console.log(`Attempting to add user with username: ${userObj.username}`);
            await UserAccountModel.create(userObj);
            console.log(`Created user with username: ${userObj.username}`);
        }

        console.log('Finished creating User Accounts');

        await ClientModel.destroy({
            where: {},
            truncate: false
        });

        for (const clientObj of CLIENT_DATA) {
            console.log(`Attempting to add client with clientName: ${clientObj.clientName}`);
            await ClientModel.create(clientObj);
            console.log(`Created client with clientName: ${clientObj.clientName}`);
        }
    } catch (e) {
        console.log(`Failed to setup timesheet data with error: ${e.toString()}`);
    }

};

timesheetSetup().then(() => {
    console.log('Finished setting up database');
    process.exit(0);
});

