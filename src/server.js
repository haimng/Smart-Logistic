//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

var Express = require('express');
var CookieParser = require('cookie-parser')
var BodyParser = require('body-parser');
var ApiRouter = require('./api/api_router');

import ServerEnv from './server_env';

let app = Express();
app.enable('trust proxy');
app.use(CookieParser());

//=====================
// API Request Handler
//=====================
app.use(BodyParser.json());
app.set('json spaces', 2);

app.use('/api', ApiRouter);
app.use('', (req, res, next) => { res.sendStatus(200); });

let server = app.listen(ServerEnv.server_port, () => {
  let host = server.address().address;
  let port = server.address().port;
  console.log('Server is Up and Running at %s:%s: ', host, port);
});
