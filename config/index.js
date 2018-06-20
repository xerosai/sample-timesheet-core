/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 18:09
 * @description Determines which configuration to load
 */

if (process.env.NODE_ENV === 'development') {
    module.exports = require('./dev');
} else {
    module.exports = require('./prod');
}