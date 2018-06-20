/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 18:59
 * @description User Account related controller methods
 */

const UserAccountModel = require('../models/UserAccount');
const {USER_ACCOUNT_ACTIONS: ACTIONS} = require('../constants').CONTROLLER_ACTIONS;
const {ControllerHelpers, JWTHelpers, ValidationHelpers} = require('../helpers');

const resource = 'UserAccountController';
const meta = {method: '', resource, uri: ''};

/**
 * @async
 * @description Given an authorization token, attempts to get the corresponding user
 * */
module.exports.getUserByAuthToken = async authToken => {
    if (!authToken) return null;

    try {
        return await UserAccountModel.findOne({
            attributes: [
                'id',
                'username',
                'emailAddress',
                'streetAddress',
                'phoneNumber',
                'createdAt',
                'updatedAt'
            ],
            where: {authToken}
        });
    } catch (e) {
        return null;
    }
};

/**
 * @async
 * @description Gets the current user profile and returns a JSON representation
 * */
module.exports.routeGetCurrentUser = async (req, res) => {

    meta.method = req.method;
    meta.uri = req.uri;

    try {
        const userAccount = req.user;

        if (!userAccount) {
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.GET_CURRENT_PROFILE, false, null, meta
            ));
        }

        const data = {
            userAccount
        };

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.GET_CURRENT_PROFILE, true, data, meta
        ));
    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.GET_CURRENT_PROFILE, false, null, meta
        ));
    }
};

/**
 * @async
 * @description Given some user-submitted data, attempts to authenticate a user
 * */
module.exports.routeAuthenticateUserLocal = async (req, res) => {

    meta.method = req.method;
    meta.uri = req.uri;

    try {
        const username = req.body.username ? req.body.username.toString().trim() : undefined;
        const password = req.body.password ? req.body.password.toString() : undefined;

        if (!username || !password) {
            meta.errorDetail = 'Username or password missing';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.AUTHENTICATE_USER_LOCAL, false, undefined, meta
            ));
        }

        const userAccount = await UserAccountModel.findOne({
            where: {username}
        });

        if (!userAccount) {
            meta.errorDetail = 'Not Found';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.AUTHENTICATE_USER_LOCAL, false, undefined, meta
            ));
        }

        const isPasswordMatched = await ValidationHelpers.isPasswordMatched(password, userAccount.password);

        if (!isPasswordMatched) {
            meta.errorDetail = 'Invalid Username or Password';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.AUTHENTICATE_USER_LOCAL, false, undefined, meta
            ));
        }

        const authToken = await JWTHelpers.generateAuthorizationToken(userAccount.id, userAccount.username, userAccount.emailAddress);

        if (!authToken) {
            meta.errorDetail = 'Failed to login user';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.AUTHENTICATE_USER_LOCAL, false, undefined, meta
            ));
        }

        userAccount.authToken = authToken;
        await userAccount.save();

        const data = {
            authToken
        };

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.AUTHENTICATE_USER_LOCAL, true, data, meta
        ));

    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.AUTHENTICATE_USER_LOCAL, false, undefined, meta
        ));
    }
};

/**
 * @async
 * @description Attempts to logout a user
 * */
module.exports.routeLogoutUser = async (req, res) => {

    meta.method = req.method;
    meta.uri = req.uri;

    try {
        const userAccount = req.user;

        if (!userAccount) {
            meta.errorDetail = 'Not Found';
            return res.status(400).json(ControllerHelpers.buildActionResult(
                ACTIONS.LOGOUT_USER_LOCAL, false, null, meta
            ));
        }

        userAccount.authToken = null;
        await userAccount.save();

        return res.json(ControllerHelpers.buildActionResult(
            ACTIONS.LOGOUT_USER_LOCAL, true, null, meta
        ));
    } catch (e) {
        meta.errorDetail = e.toString();
        return res.status(400).json(ControllerHelpers.buildActionResult(
            ACTIONS.LOGOUT_USER_LOCAL, false, null, meta
        ));
    }
};