//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

var Router = require('express').Router();
var UtilApi = require('./util_api');
var UserApi = require('./user_api');
var PackageApi = require('./package_api');
var FeedbackApi = require('./feedback_api');
var NoticeApi = require('./notice_api');
var FriendApi = require('./friend_api');
var MessageApi = require('./message_api');

import H from '../lib/helper';
import Log from '../lib/log';
import SessionModel from '../models/session_model';

Router.use((req, res, next) => {
  // Log request
  H.logRequest(req);
  //Log.debug('req.params: ',req.params);
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
  req._sid = H.getCookie('_sid', req);
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
Router.use('/feedback', FeedbackApi);
Router.use('/notice', NoticeApi);
Router.use('/friend', FriendApi);
Router.use('/message', MessageApi);

module.exports = Router;
