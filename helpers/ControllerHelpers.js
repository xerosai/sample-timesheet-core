/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 19:05
 * @description A collection of helper methods that can be used with Controllers
 */

/**
 * @description returns an organized object that can be sent as a JSON response
 * @param {string} action - the name of the action. eg. AUTHENTICATE_USER_LOCAL
 * @param {boolean} success - indicates whether or not the action was successful
 * @param {object} data - an object that contains data related to the action. eg. AUTHENTICATE_USER_LOCAL may have data.authorizationToken: [SOME_TOKEN]
 * @param {object} meta - an object that contains additional information related to the action
 * */
module.exports.buildActionResult = (action, success = false, data = {}, meta = {}) => {
    return {
        action,
        success,
        data,
        meta
    };
};