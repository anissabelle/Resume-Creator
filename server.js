import express from 'express';
// Grabs our Routes
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

const HTTP_PORT = 8001;
const app = express();

app.use(express.json());
// Serve index.html, index.js, css files, etc.
// "Allow the browser to access static files from this folder" 
// "." means the current project folder where your server is running
// Allows express to serve frontend files
app.use(express.static("."));

/*
    Register the preview API routes so requests such as /signUp and /login
    are actually attached to the running Express application.
*/
registerIndexPreviewRoutes(app);

app.listen(HTTP_PORT, () => {
    console.log(`Listening on ${HTTP_PORT}`);
});
