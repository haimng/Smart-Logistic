//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

var nodemailer = require('nodemailer');

import ServerEnv from '../server_env';
import Mail from '../server_lib/mail';

/*****************************/
var funcs = {};

funcs.mail = () => {
  Mail.sendWelcome({to: 'vnjp22@gmail.com', user: {first_name:'Hai'}});
};

const func = process.argv[2];
console.log(`=== Run ${func}()`);
funcs[func]();
