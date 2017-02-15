//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

var UserApi = require('express').Router();

import Uuid from 'node-uuid';
import Bcrypt from 'bcrypt-nodejs';
import ServerEnv from '../server_env';
import Util from '../server_lib/util';
import AuthVerifier from '../server_lib/auth_verifier';
import Mail from '../server_lib/mail';
import H from '../lib/helper';
import UserModel from '../models/user_model';
import SessionModel from '../models/session_model';

import {FACEBOOK, GOOGLE, USER_FIELDS} from '../const';

function addSession(user, req, res) {
  user = Util.sanitizeValue(user);
  
  var sid = Uuid.v4();
  SessionModel.add(sid, user,
    (result) => {
      if(req._sid)  SessionModel.deleteById(req._sid);
      
      res.cookie('_sid', sid, {path: '/', maxAge: 31536000000}); // session expires in 1 year
      user.sid = sid;
      H.resSuccess(res, user);
    }, 
    () => {
      H.resFailure(res);
    });
}

function updateSession(sid, user, res) {
  user = Util.sanitizeValue(user);
  SessionModel.updateById(sid, user,
    (result) => {
      if(res)  H.resSuccess(res, user);
    }, 
    () => {
      if(res)  H.resFailure(res);
    });
}

function removeSession(req, res) {
  SessionModel.deleteById(req._sid);
  
  res.clearCookie('_sid');
  H.resSuccess(res);
}

UserApi.post('/signup', (req, res) => {
  var {email, password, first_name, last_name} = req.body;
  var data = {email: email, password: password, first_name: first_name, last_name: last_name};
  data = H.validateSignup(data);
  if(data.err)  return H.resInvalid(res, data.err);  
  
  data.display_name = data.last_name +' '+ data.first_name; 
  UserModel.signup(data,
    (user) => {
      if(email)  Mail.sendWelcome({to: email, user: user});
      
      user = H.filterFields(user, USER_FIELDS);
      addSession(user, req, res);
    }, 
    (err) => {
      H.resInvalid(res, err);
    });
});

UserApi.post('/signin', (req, res) => {
  var body = req.body;
  if(!body.email || !body.password)  return H.resInvalid(res, H.l("Please fill in email and password to login."));
  
  var data = {email: body.email, password: body.password};
  UserModel.signin(data,
    (user) => {
      user = H.filterFields(user, USER_FIELDS);
      addSession(user, req, res);
    }, 
    (err) => {
      H.resInvalid(res, err);
    });
});

UserApi.post('/login', (req, res) => {
  var {provider, provider_id, signed_request, email, first_name, last_name, avatar} = req.body;
  if((provider != FACEBOOK && provider != GOOGLE) || !provider_id || !signed_request)  return H.resInvalid(res);
  
  var secret = provider == FACEBOOK ? ServerEnv.fb.app_secret : ServerEnv.google.client_id;
  var verifier = new AuthVerifier(provider, provider_id, secret, signed_request);
  verifier.verify((result) => {
    if(avatar)  avatar = avatar.replace('https://','//').replace('http://','//');
    var data = {
      provider: provider,
      provider_id: provider_id,
      first_name: first_name, 
      last_name: last_name, 
      display_name: last_name +' '+ first_name,
      email: email || '', 
      avatar: avatar || '',
    };
    
    UserModel.login(data,
      (user, is_new) => {
        if(is_new && email)  Mail.sendWelcome({to: email, user: user});
        
        user = H.filterFields(user, USER_FIELDS);
        addSession(user, req, res);
      }, 
      (err) => {
        H.resInvalid(res, err);
      });
    
  }, (err) => {
    H.resInvalid(res, H.l("Login error"));
  });
});

UserApi.post('/signout', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  removeSession(req, res);
});

UserApi.get('/:id', (req, res) => {
  var params = req.params;
  var uid = params.id;
  
  let getUser = () => {
    UserModel.get(uid, 
      (user) => {
        user = H.filterFields(user, USER_FIELDS);
        H.resSuccess(res, user);
      },
      () => {
        H.resNotfound(res);
      });
  };
  
  if(uid=='me') {
    SessionModel.get(req._sid, 
      (data) => {
        var data = JSON.parse(data.data);
        if(data.id)  uid = data.id;
        getUser();
      },
      () => {
        H.resUnauthorized(res);
      });
  }
  else {
    getUser();
  }
});

UserApi.put('/me', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  var id = req._user.id;
  var {prop, value} = req.body;
  
  var data = {}; 
  data[prop] = value;
  
  UserModel.updateById(id, data, 
    (result) => {
      
      if(['display_name'].indexOf(prop) >= 0) {
        var user = req._user;
        user[prop] = value;
        updateSession(req._sid, user);  
      }
      
      H.resSuccess(res);
    },
    () => { 
      H.resFailure(res); 
    });
});

UserApi.post('/forgot_password', (req, res) => {
  var {email} = req.body;
  if(!email)  return H.resFailure(res);
  
  UserModel.find({email:email, provider:''}, (user) => {
    var confirm_auth = Uuid.v4();
    
    UserModel.updateById(user.id, {confirm_auth:confirm_auth}, () => {
      user.confirm_auth = confirm_auth;
      Mail.sendForgotPassword({to:email, user:user});
      
      H.resSuccess(res);
    }, () => {
      H.resFailure(res);
    });
  }, () => {
    H.resInvalid(res, H.l("Email doesn't exist"));
  })
});

UserApi.post('/reset_password', (req, res) => {
  var {email,confirm_auth,password} = req.body;
  if(!email || !confirm_auth || !password || password.length < 8 || password.length > 20)  return H.resFailure(res);
  
  UserModel.find({email:email, confirm_auth:confirm_auth, provider:''}, (user) => {
    UserModel.updateById(user.id, {password: Bcrypt.hashSync(password), confirm_auth:'0'}, () => {
      H.resSuccess(res);
    }, () => {
      H.resFailure(res);
    });
  }, () => {
    H.resFailure(res);
  })
});

module.exports = UserApi;
