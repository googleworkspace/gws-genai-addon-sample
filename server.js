/**
 * Copyright 2023 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
