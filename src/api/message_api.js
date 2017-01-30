let MessageApi = require('express').Router();

import H from '../lib/helper';
import MessageModel from '../models/message_model';
import NoticeModel from '../models/notice_model';

import {NOTICE_FRIEND, NOTICE_FOLLOW, NOTICE_MESSAGE, NOTICE_LIKE, NOTICE_COMMENT} from '../const';

MessageApi.get('', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id; 
  let {fid,limit,from} = req.query;

  let cond = {OR: [ {uid:uid, fid:fid}, {uid:fid, fid:uid} ]};
  let opt = { cond:cond, limit:limit || 10, offset:from || 0, order:'id desc' };
  MessageModel.select(opt, (result) => {
    H.resSuccess(res, result);
  }, () => {
    H.resFailure(res);
  });
});

MessageApi.post('', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let fid = req._user.id;
  let {uid,body} = req.body;

  let value = {uid:uid, fid:fid, body:body};
  MessageModel.insert({value:value}, (result) => {
    // Notice message
    let notice = {uid:uid, fid:fid, type:NOTICE_MESSAGE};
    NoticeModel.insertValue(notice, ()=>{}, ()=>{});
    
    H.resSuccess(res);
  }, () => {
    H.resFailure(res);
  });
});

module.exports = MessageApi;
