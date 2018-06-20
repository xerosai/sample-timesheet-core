/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 20:15
 * @description A collection of user account related routes
 */

const router = require('express').Router();

const UserAccountController = require('../controllers/UserAccountController');
const RequireAuth = require('../middleware/RequireAuthorization');

// USER SPECIFIC
router.get('/me', RequireAuth, UserAccountController.routeGetCurrentUser);

// AUTHENTICATION

// LOGIN
router.post('/login', UserAccountController.routeAuthenticateUserLocal);

// LOGOUT
router.post('/logout', RequireAuth, UserAccountController.routeLogoutUser);

module.exports = router;