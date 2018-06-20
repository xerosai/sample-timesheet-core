/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 19:37
 */

const {AUTH_MIDDLEWARE_ACTIONS} = require('../constants').CONTROLLER_ACTIONS;
const {buildActionResult} = require('../helpers/ControllerHelpers');
const {decodeAuthorizationToken} = require('../helpers/JWTHelpers');
const {getUserByAuthToken} = require('../controllers/UserAccountController');


/**
 * @async
 * @description Middleware that enforces authorization
 * */
module.exports = async (req, res, next) => {

    const meta = {errorDetail: undefined};

    try {
        const authToken = req.headers['x-auth-token'] || undefined;

        if (!authToken) {
            meta.errorDetail = 'Invalid Authorization';
            return res.status(401).json(buildActionResult(
                AUTH_MIDDLEWARE_ACTIONS.VALIDATE_AUTH, false, null, meta
            ));
        }

        const userAccount = await getUserByAuthToken(authToken);

        if (!userAccount) {
            meta.errorDetail = 'Invalid Account';
            return res.status(401).json(buildActionResult(
                AUTH_MIDDLEWARE_ACTIONS.VALIDATE_AUTH, false, null, meta
            ));
        }

        req.user = userAccount;

        next();
    } catch (e) {
        meta.errorDetail = 'Oops. This wasn\'t supposed to happen';
        return res.status(400).json(buildActionResult(
            AUTH_MIDDLEWARE_ACTIONS.VALIDATE_AUTH, false, null, meta
        ));
    }
};