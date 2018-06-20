/**
 * @author Simon Neufville <simon@xrscodeworks.com / sneufville@teammps.com>
 * Created: June 19 2018 @ 17:32
 * @description Main entry point of the Time sheet API. Routes will be handled by its own router module
 */

const express = require('express');
const bodyParser = require('body-parser');

const {dbConnect} = require('./db');
const AppRouter = require('./router');

const app = express();

// Apply middleware
app.use(bodyParser.json({
    limit: '256kb'
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

if (process.env.NODE_ENV !== 'production') {
    console.log('Loading development modules');
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

// APPLICATION ROUTER
AppRouter(app);


// SERVER STARTUP
const PORT = process.env.SERVER_PORT || 8101;

app.listen(PORT, async () => {
    console.log(`Started API server on port: ${PORT}`);
    console.log(`API routes have a base URL of: /api/v1`);

    const connectionResult = await dbConnect();
    console.log(`Successfully connected to database: ${connectionResult.success}`);
});