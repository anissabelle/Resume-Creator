import express from 'express';
import registerIndexPreviewRoutes from './api/routing/indexPreviewRoutes.js';

/**********************************************************************
 *
 * Main Express Server
 *
 * This file stays small on purpose. The route logic lives in the
 * separate preview route file so you can review and move pieces around
 * more easily while building the project.
 *
 **********************************************************************/

const intHttpPort = 8001;
const app = express();

/*
    This middleware allows Express to read JSON request bodies sent from
    the frontend fetch requests in js/index.js.
*/
app.use((objRequest, objResponse, fnNext) => {
    objResponse.header('Access-Control-Allow-Origin', '*');
    objResponse.header('Access-Control-Allow-Headers', 'Content-Type');
    objResponse.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');

    if (objRequest.method === 'OPTIONS') {
        return objResponse.sendStatus(204);
    }

    return fnNext();
});

app.use(express.json());
// Serve index.html, index.js, css files, etc.
app.use(express.static("."));

/*
    Register the preview API routes so requests such as /signUp and /login
    are actually attached to the running Express application.
*/
registerIndexPreviewRoutes(app);

app.listen(intHttpPort, () => {
    console.log(`Listening on ${intHttpPort}`);
});
