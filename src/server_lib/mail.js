//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

var Nodemailer = require('nodemailer');
var Fs = require('fs');

import H from '../lib/helper';
import ServerEnv from '../server_env';

import {META} from '../config';
import {NOTICE_FRIEND, NOTICE_FOLLOW, NOTICE_MESSAGE, NOTICE_LIKE, NOTICE_COMMENT} from '../const';
import {NOTICE_STATUS_UNREAD, NOTICE_STATUS_READ, NOTICE_STATUS_FRIEND_APPROVED, NOTICE_STATUS_FRIEND_REJECTED} from '../const';
//import {NOTICE_TEXT} from '../components/notice_list';

const SIGNATURE = `---
${H.l("Warm regards,")}
${H.l("Team {name}",{name:META.name})}
${ServerEnv.domain}`;

class Mail {
  constructor() {
    this.transporter = Nodemailer.createTransport(ServerEnv.mail);
  }
  
  // opt: {to,subject,text,html}
  send(opt, callback) {    
    opt.from = ServerEnv.mail.from;
    this.transporter.sendMail(opt, (error, info) => {
      if(error) {
        console.log(error);
        if(callback)  callback();
        return
      }
      
      console.log('Message sent: ' + info.response);
      if(callback)  callback();
    });
  }
  
  sendNotice(opt, callback) {
    let {user,notices} = opt;
    
    let template = __dirname + '/../../static/mail/notice.html';
    Fs.readFile(template, (err, body) => {
      if(err)  return console.log(err);
      
      let avatar = user.avatar || 'http://umon.biz/img/avatar.png';
      if(!avatar.hasPrefix('http:'))  avatar = 'http:'+avatar;
      
      let notice_list = '';
      for(let type in notices) {
        let notice_count = notices[type];
//        let notice_text = NOTICE_TEXT[type];
        let notice_text = '';
        
        notice_list += `
        <tr>
          <td width="34" style="display: block; width: 34px">&nbsp;&nbsp;&nbsp;</td>
          <td valign="middle">
            <a href="${ServerEnv.domain}" style="color: #3b5998; text-decoration: none" target="_blank"><img src="http://umon.biz/img/logo2_90.png" style="border: 0; width: 16px"></a>
          </td>
          <td width="10" style="display: block; width: 10px">&nbsp;&nbsp;&nbsp;</td>
          <td width="100%" valign="middle"><span style="font-family: Helvetica Neue, Helvetica, Lucida Grande, tahoma, verdana, arial, sans-serif; font-size: 14px; line-height: 19px; color: #141823">
            <a href="${ServerEnv.domain}" style="color: #3b5998; text-decoration: none" target="_blank">
              <b>${notice_count}</b> ${H.l("people")} ${notice_text} 
            </a>
          </span>
          </td>
        </tr>
        <tr><td height="3" style="line-height: 3px">&nbsp;</td></tr>`;
      }
      
      let params = {
        domain: ServerEnv.domain,
        title: H.l("You have new notifications."),
        description: H.l("A lot has happened on {name} since you last logged in. Here are some notifications you've missed from your friends.",{name:META.name}),
        btn1: H.l("Go to {name}",{name:META.name}),
        btn2: H.l("View Notifications"),
        first_name: user.first_name,
        avatar: avatar,
        notice_list: notice_list,
        unsubscribe: H.l("If you don't want to receive these emails from us in the future, please contact our support to unsubscribe."),
      };
      console.log('params',params);
      
      body = body.toString();
      for(let k in params)  body = body.replaceAll('{{'+k+'}}', params[k]);
      
      var options = {
        to: user.email,
        subject: H.l("{first_name}, you have new notifications from your friends. {date}", {first_name:user.first_name, date:H.currentDateTime}),
        html: body,
      };
      this.send(options, callback);
    });
  }
  
  sendWelcome(opt) {
    var {to,user} = opt;
    var options = {
        to: to,
        subject: `${H.l("Thank {first_name} for joining {name}",{first_name:user.first_name, name:META.name})}`,
        text: 
`${H.l("Hello {first_name},",{first_name:user.first_name})}

${H.l("Thank you for joining {name}. We hope that you will have a good time with our community :)",{name:META.name})}

${SIGNATURE}`   
    };
    this.send(options);
  }
  
  sendForgotPassword(opt) {
    var {to,user} = opt;
    var options = {
        to: to,
        subject: `${H.l("Reset password for {first_name}",{first_name:user.first_name})}`,
        text: 
`${H.l("Hello {first_name},",{first_name:user.first_name})}

${H.l("Here is the link to reset your password. Please open it and follow the instruction. Thank you.")}

${ServerEnv.domain}/user/reset_password?email=${H.urlEncode(to)}&confirm_auth=${H.urlEncode(user.confirm_auth)}

${SIGNATURE}`   
    };
    this.send(options);
  }  
  
}

const mail = new Mail();
export default mail;
