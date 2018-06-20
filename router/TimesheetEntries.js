/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 20 2018 @ 01:42
 */

const router = require('express').Router();

const RequireAuth = require('../middleware/RequireAuthorization');
const TimesheetEntriesController = require('../controllers/TimesheetEntryController');

// GET ENTRIES FOR CURRENT USER
router.get('/', RequireAuth, TimesheetEntriesController.routeGetUserEntries);

// CREATE ENTRY
router.post('/', RequireAuth, TimesheetEntriesController.routeCreateEntry);

// UPDATE
router.put('/:id', RequireAuth, TimesheetEntriesController.routeUpdateEntry);

// DELETE
router.delete('/:id', RequireAuth, TimesheetEntriesController.routeDeleteEntry);

module.exports = router;