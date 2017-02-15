//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

let Router = require('express').Router();
let UtilApi = require('./util_api');
let UserApi = require('./user_api');
let PackageApi = require('./package_api');
let ReceiverApi = require('./receiver_api');
let FeedbackApi = require('./feedback_api');
let NoticeApi = require('./notice_api');
let FriendApi = require('./friend_api');
let MessageApi = require('./message_api');

import H from '../lib/helper';
import Log from '../lib/log';
import SessionModel from '../models/session_model';

Router.use((req, res, next) => {
  // Log request
  H.logRequest(req);
//  Log.debug('req.headers: ',req.headers);
//  Log.info('req.headers.cookie: ',req.headers.cookie);
  Log.debug('req.query: ',req.query);
  Log.debug('req.body: ',req.body);
  
  // Response settings
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
//  res.set('Transfer-Encoding', '');
//  res.set('Content-Encoding', '');

//  res.set('Access-Control-Allow-Origin', '*');
//  res.set('Access-Control-Allow-Headers', 'origin, content-type, accept');
//  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
//  res.set('Access-Control-Allow-Credentials', 'true');
  
  // Session user
  req._sid = req.cookies['_sid'];
  if(req._sid) {
    SessionModel.get(req._sid, 
      (session) => {
        req._user = H.sessionUser(session);
        next();
      },
      () => {
        next();
      });
  }
  else {
    next();
  }
});

Router.use('/util', UtilApi);
Router.use('/user', UserApi);
Router.use('/package', PackageApi);
Router.use('/receiver', ReceiverApi);
Router.use('/feedback', FeedbackApi);
Router.use('/notice', NoticeApi);
Router.use('/friend', FriendApi);
Router.use('/message', MessageApi);

module.exports = Router;
