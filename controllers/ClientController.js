/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 20 2018 @ 01:11
 */

const ClientModel = require('../models/Client');
const {ControllerHelpers} = require('../helpers');
const {CLIENT_ACTIONS: ACTIONS} = require('../constants').CONTROLLER_ACTIONS;

const resource = 'ClientController';
const meta = {method: '', resource, uri: ''};

/**
 * @async
 * @description Given an id, attempts to get the corresponding client
 * */
module.exports.getClientById = async id => {
    if (!id) return null;

    try {
        return await ClientModel.findById(id);
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.log(`Failed to get client by id: ${id} with error: ${e.toString()}`);
        return null;
    }
};

/**
 * @async
 * @description Fetches a list of clients with pagination (optional)
 * */
module.exports.routeGetClientList = async (req, res) => {

    meta.method = req.method;
    meta.uri = req.uri;

    try {

        if (!req.user) {
            meta.errorDetail = 'Unauthorized';
            return res.status(403).json(ControllerHelpers.buildActionResult(
                ACTIONS.GET_CLIENT_LIST, false, null, meta
            ));
        }

        let page = req.query.page ? parseInt(req.query.page) : 0;

        if (page < 0) page = 0;

        const clients = await ClientModel.findAll({limit: 10, offset: page * 10});

        const data = {
            results: clients
        };

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.GET_CLIENT_LIST, true, data, meta
        ));

    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.GET_CLIENT_LIST, false, null, meta
        ));
    }
};