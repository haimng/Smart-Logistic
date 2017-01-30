var FriendApi = require('express').Router();

import H from '../lib/helper';
import FriendModel from '../models/friend_model';
import NoticeModel from '../models/notice_model';

import {NOTICE_FRIEND, NOTICE_FOLLOW, NOTICE_MESSAGE, NOTICE_COMMENT} from '../const';
import {NOTICE_STATUS_UNREAD, NOTICE_STATUS_READ, NOTICE_STATUS_FRIEND_APPROVED, NOTICE_STATUS_FRIEND_REJECTED} from '../const';

FriendApi.get('', (req, res) => {
  var {uid,limit,from} = req.query;

  var opt = { cond:{uid:uid}, limit:limit || 12, offset:from || 0 };
  FriendModel.select(opt, (result) => {
    H.resSuccess(res, result);
  }, () => {
    H.resFailure(res);
  });
});

FriendApi.post('/request', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  var fid = req._user.id;
  var {uid} = req.body;

  var cond = {uid:uid, fid:fid, type:NOTICE_FRIEND};
  var value = cond;
  NoticeModel.add(cond, value, (result) => {
    H.resSuccess(res);
  }, () => {
    H.resFailure(res);
  });
});

FriendApi.get('/request', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  var fid = req._user.id;
  var {uid} = req.query;

  NoticeModel.find({uid:uid, fid:fid, type:NOTICE_FRIEND}, (result) => {
    H.resSuccess(res, result);
  }, () => {
    H.resFailure(res);
  });
});

FriendApi.put('/request/:id', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  var {id} = req.params;
  var {fid,type,status} = req.body;

  var value = {status:status};
  NoticeModel.updateById(id, value, (result) => {
    
    // Approve friend
    if(type==NOTICE_FRIEND && status==NOTICE_STATUS_FRIEND_APPROVED) {
      var uid = req._user.id;
      
      // Add friend
      var friend = {uid:uid, fid:fid};
      FriendModel.add(friend, friend, ()=>{}, ()=>{});
      
      // Notice friend
      var cond = {uid:fid, fid:uid, type:NOTICE_FRIEND, status:NOTICE_STATUS_FRIEND_APPROVED};
      NoticeModel.add(cond, cond, ()=>{}, ()=>{});  
    }
    
    H.resSuccess(res);
  }, () => {
    H.resFailure(res);
  });
});

module.exports = FriendApi;
