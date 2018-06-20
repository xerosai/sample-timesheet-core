/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 19:30
 */

const jwt = require('jsonwebtoken');
const {APP_CONFIG} = require('../config');

/**
 * @async
 * @description Generates an authorization token given a user's email address, username and id
 * */
module.exports.generateAuthorizationToken = async (id, username, emailAddress) => {
    if (!id || !username || !emailAddress) return null;

    try {
        return await jwt.sign({id, username, emailAddress}, APP_CONFIG.SECRET);
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Failed to generate authorization token with error: ${e.toString()}`);
        }
        return null;
    }
};

/**
 * @async
 * @description Given an authorization token, attempts to decode it and return
 * */
module.exports.decodeAuthorizationToken = async authToken => {
    if (!authToken) return null;

    try {
        return await jwt.verify(authToken, APP_CONFIG.SECRET)
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Failed to decode authorization token with error: ${e.toString()}`);
        }
        return null;
    }
};