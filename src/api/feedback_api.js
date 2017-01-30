var FeedbackApi = require('express').Router();

import H from '../lib/helper';
import FeedbackModel from '../models/feedback_model';

FeedbackApi.post('', (req, res) => {
  var {email, message, page} = req.body;
  
  var uid = req._user ? req._user.id : '';
  var value = {message:message, page:page};
  if(uid)  value.uid = uid;
  if(email)  value.email = email;
  
  FeedbackModel.insert({value:value}, (result) => {
    H.resSuccess(res);
  }, () => {
    H.resFailure(res);
  });
});

module.exports = FeedbackApi;
