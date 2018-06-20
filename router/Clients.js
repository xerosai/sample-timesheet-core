/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 20 2018 @ 01:22
 */

const router = require('express').Router();

const RequireAuth = require('../middleware/RequireAuthorization');
const ClientController = require('../controllers/ClientController');

// CLIENT LIST
router.get('/', RequireAuth, ClientController.routeGetClientList);

module.exports = router;