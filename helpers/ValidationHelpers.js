/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 20:33
 */

const bcrypt = require('bcrypt');
const {HASH_ROUNDS} = require('../config').APP_CONFIG;

/**
 * @async
 * @description Given a plain-text password, uses bcrypt to generate a hashed version or returns undefined
 * */
module.exports.generatePasswordHash = async passwordString => {
    if (!passwordString) return null;

    try {
        return await bcrypt.hash(passwordString, HASH_ROUNDS);
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.log(`Failed to generate password hash with error: ${e.toString()}`);
        return null;
    }
};


/**
 * @async
 * @description Given a plain-text password and a hashed password, determines if they are matching
 * */
module.exports.isPasswordMatched = async (passwordString, hashedPassword) => {
    console.log(`try to compare password: ${passwordString} with hash: ${hashedPassword}`);
    if (!passwordString || !hashedPassword) return false;


    try {
        return await bcrypt.compare(passwordString, hashedPassword);
    } catch (e) {
        if (process.env.NODE_ENV !== 'production') console.log(`Failed to validate password with with error: ${e.toString()}`);
        return null;
    }
};