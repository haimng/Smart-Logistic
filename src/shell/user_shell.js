//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

var nodemailer = require('nodemailer');

import ServerEnv from '../server_env';
import H from '../lib/helper';
import Mail from '../server_lib/mail';
import UserModel from '../models/user_model';
import NoticeModel from '../models/notice_model';

/*****************************/
var funcs = {};

funcs.notice = () => {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  let yesterday = H.formatDate(date, 'yyyy-mm-dd') + ' 00:00:00';
  console.log('yesterday',yesterday);
  
  NoticeModel.list({'updated_gte':yesterday}, (notices) => {
//    console.log('notices',notices);
    let uids = [];
    let uid_notices = {};
    notices.map((n) => {
      let uid = n.uid;
      if(!uid_notices[uid]) {
        uids.push(uid);
        uid_notices[uid] = {};
      }
      let c = uid_notices[uid][n.type] || 0;
      uid_notices[uid][n.type] = c+1;
    });
    console.log('uids',uids);
    console.log('uid_notices',uid_notices);
    
    let from = 0, to = uids.length-1;
    H.execute(from, to, (i,next) => {
      let uid = uids[i];
      console.log('uid',uid);
      
      UserModel.get(uid, (user) => {
        if(!user || !user.email)  return next();
        
        Mail.sendNotice({user:user, notices:uid_notices[uid]}, () => { next(); });
        
      }, () => { next(); });
    });
  }, () => {});
};

const func = process.argv[2];
console.log(`=== Run ${func}()`);
funcs[func]();
