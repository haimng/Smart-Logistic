var NoticeApi = require('express').Router();

import H from '../lib/helper';
import NoticeModel from '../models/notice_model';

NoticeApi.get('', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  var uid = req._user.id;
  var {limit, from} = req.query;

  var opt = {cond:{uid:uid}, limit:limit || 10, offset:from || 0, order:'id desc'};
  NoticeModel.select(opt, (result) => {
    H.resSuccess(res, result);
  }, () => {
    H.resFailure(res);
  });
});

module.exports = NoticeApi;
