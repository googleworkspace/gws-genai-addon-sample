//
// This is where the app starts, and sets things up
// We require the packages we need, body parser and express, and then set up body parser to accept
// JSON and URL encoded values. We then include the `routes.js` file, in which we define the API
// end-points we're going to be using, and we pass it the `app` variable. Lastly, we specify the
// port to listen to for requests. In this case, port 3000.
//
import express from 'express';
import bearerToken from 'express-bearer-token';
import bodyParser from 'body-parser';
import routes from './routes.js';

const app = express();

// Needed if there is a proxy forwarding https to http
app.enable('trust proxy');

app.use(bearerToken());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

routes(app);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on port ${port}`));

export default app;
