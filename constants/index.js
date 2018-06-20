/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 19:12
 */

/**
 * @description A collection of controller-related action strings
 * */
module.exports.CONTROLLER_ACTIONS = {
    AUTH_MIDDLEWARE_ACTIONS: {
        VALIDATE_AUTH: 'VALIDATE_AUTHORIZATION'
    },
    CLIENT_ACTIONS: {
        GET_CLIENT_LIST: 'GET_CLIENT_LIST',
        GET_CLIENT_DETAIL: 'GET_CLIENT_DETAIL'
    },
    TIMESHEET_ACTIONS: {
        GET_TIMESHEET_LIST: 'GET_TIMESHEET_LIST',
        CREATE_TIMESHEET_ENTRY: 'CREATE_TIMESHEET_ENTRY',
        UPDATE_TIMESHEET_ENTRY: 'UPDATE_TIMESHEET_ENTRY',
        DELETE_TIMESHEET_ENTRY: 'DELETE_TIMESHEET_ENTRY'
    },
    USER_ACCOUNT_ACTIONS: {
        AUTHENTICATE_USER_LOCAL: 'AUTHENTICATE_USER_LOCAL',
        GET_CURRENT_PROFILE: 'GET_CURRENT_PROFILE',
        LOGOUT_USER_LOCAL: 'LOGOUT_USER_LOCAL'
    }
};