/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 20 2018 @ 01:30
 * @description A collection of timesheet entry related controller methods
 */

const _ = require('lodash');
const moment = require('moment');

const TimesheetEntryModel = require('../models/TimesheetEntry');
const ClientModel = require('../models/Client');
const {getClientById} = require('./ClientController');
const {ControllerHelpers} = require('../helpers');
const {TIMESHEET_ACTIONS: ACTIONS} = require('../constants').CONTROLLER_ACTIONS;

const resource = 'TimesheetController';
const meta = {method: '', resource, uri: '', errorDetail: ''};

/**
 * @async
 * @description Given an id and userId, attempts to delete the corresponding timesheet entry
 * */
const getEntryById = async (id, userId) => {
    if (!id || !userId) return null;

    try {
        return await TimesheetEntryModel.findOne({
            where: {
                id,
                userAccountId: userId
            }
        });
    } catch (e) {
        return null;
    }
};

/**
 * async
 * description given an optional id, data and user id, creates o timesheet entry or updates an existing one
 * */
// const createOrUpdateEntry = async (id = undefined, data, userId) => {
//
// }

/**
 * @async
 * @description Given user-submitted data, creates a timesheet entry
 * */
module.exports.routeCreateEntry = async (req, res) => {

    meta.method = req.method;
    meta.uri = req.uri;

    try {
        const clientId = req.body.clientId ? parseInt(req.body.clientId) : undefined;

        if (!clientId) {
            meta.errorDetail = 'Invalid Client Id';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.CREATE_TIMESHEET_ENTRY, false, null, meta
            ));
        }

        const relatedClient = await getClientById(clientId);

        if (!relatedClient) {
            meta.errorDetail = 'Client Not Found';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.CREATE_TIMESHEET_ENTRY, false, null, meta
            ));
        }

        const requiredFields = ['startDate', 'endDate', 'jobTitle', 'comments'];

        const bodyData = _.pick(req.body, requiredFields);

        console.log('body data: ', bodyData);

        const startDate = parseInt(bodyData.startDate);
        const endDate = parseInt(bodyData.endDate);

        bodyData.startDate = moment.unix(parseInt(bodyData.startDate));
        bodyData.endDate = moment.unix(parseInt(bodyData.endDate));

        const entryData = {...bodyData, clientId: relatedClient.id, userAccountId: req.user.id, overtime: Math.abs(endDate - startDate)};

        console.log(entryData);

        const timesheetEntry = await TimesheetEntryModel.create(entryData);

        const data = {
            result: timesheetEntry
        };

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.CREATE_TIMESHEET_ENTRY, true, data, meta
        ));

    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.CREATE_TIMESHEET_ENTRY, false, null, meta
        ));
    }
};

/**
 * @async
 * @description Gets the list of timesheet entries for the current user
 * */
module.exports.routeGetUserEntries = async (req, res) => {
    meta.method = req.method;
    meta.uri = req.uri;

    try {

        const userAccount = req.user;

        if (!userAccount) {
            meta.uri = 'Unauthorized';
            return res.status(403).json(ControllerHelpers.buildActionResult(
                ACTIONS.GET_TIMESHEET_LIST, false, null, meta
            ));
        }

        const queryObj = {
            userAccountId: userAccount.id,
        };

        let page = req.query.page ? parseInt(req.query.page) : 0;

        if (page < 0) page = 0;

        const filterObj = {
            limit: 10, offset: page * 10
        };

        const results = await TimesheetEntryModel.findAll({
            where: queryObj,
            include: [ClientModel]
        }, filterObj);

        const data = {
            results,
            queryObj,
            filterObj
        };

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.GET_TIMESHEET_LIST, true, data, meta
        ));

    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.GET_TIMESHEET_LIST, false, null, meta
        ));
    }
};

/**
 * @async
 * @description Given an id and user-submitted data, updates the corresponding timesheet entry
 * */
module.exports.routeUpdateEntry = async (req, res) => {

    meta.method = req.method;
    meta.uri = req.uri;

    try {
        const clientId = req.body.clientId ? parseInt(req.body.clientId) : undefined;

        if (!clientId) {
            meta.errorDetail = 'Invalid Client Id';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.CREATE_TIMESHEET_ENTRY, false, null, meta
            ));
        }

        const relatedClient = await getClientById(clientId);

        if (!relatedClient) {
            meta.errorDetail = 'Client Not Found';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.CREATE_TIMESHEET_ENTRY, false, null, meta
            ));
        }

        const timesheetEntry = await getEntryById(req.params.id, req.user.id);

        if (!timesheetEntry) {
            meta.errorDetail = 'Timesheet Not found';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.UPDATE_TIMESHEET_ENTRY, false, null, meta
            ));
        }

        const requiredFields = ['startDate', 'endDate', 'jobTitle', 'comments'];

        const bodyData = _.pick(req.body, requiredFields);

        const startDate = parseInt(bodyData.startDate);
        const endDate = parseInt(bodyData.endDate);

        bodyData.startDate = moment.unix(parseInt(bodyData.startDate));
        bodyData.endDate = moment.unix(parseInt(bodyData.endDate));

        const entryData = {...bodyData, clientId: relatedClient.id, userAccountId: req.user.id, overtime: Math.abs(endDate - startDate)};

        await timesheetEntry.update(entryData);

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.UPDATE_TIMESHEET_ENTRY, true, null, meta
        ));

    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.UPDATE_TIMESHEET_ENTRY, false, null, meta
        ));
    }
};

/**
 * @async
 * @description Given an id, attempts to delete the corresponding timesheet entry for the current user
 * */
module.exports.routeDeleteEntry = async (req, res) => {

    meta.method = req.method;
    meta.uri = req.uri;

    try {
        const timesheetEntry = await getEntryById(req.params.id, req.user.id);

        if (!timesheetEntry) {
            meta.errorDetail = 'Not Found';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.DELETE_TIMESHEET_ENTRY, false, null, meta
            ));
        }

        await timesheetEntry.destroy({force: true});

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.DELETE_TIMESHEET_ENTRY, true, null, meta
        ))
    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.DELETE_TIMESHEET_ENTRY, false, null, meta
        ));
    }
};