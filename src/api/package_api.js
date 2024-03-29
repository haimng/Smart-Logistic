let PackageApi = require('express').Router();

import Uuid from 'node-uuid';
import H from '../lib/helper';
import PackageModel from '../models/package_model';
import PackageHistoryModel from '../models/package_history_model';
//import NoticeModel from '../models/notice_model';

//import {NOTICE_FRIEND, NOTICE_FOLLOW, NOTICE_MESSAGE, NOTICE_LIKE, NOTICE_COMMENT} from '../const';
import {NEW, SRC_PORTAL, DELIVERING, DEST_PORTAL, DELIVERED} from '../const';
import {PORTAL, DRIVER, SURVEYOR} from '../const';

PackageApi.post('', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id;
  let {rid,title,description,price,size,weight} = req.body;
  let code = Uuid.v4();
  let value = {sid:uid, rid:rid, code:code, title:title, description:description, price:price, size:size, weight:weight};
  // TODO: validate values
  
  PackageModel.insert({value:value}, (result) => {
    // TODO: Notice
    
    value.id = result.insertId;
    value.status = NEW;
    
    // Log package history
    let history = {pid:value.id, uid:uid, status:NEW};
    PackageHistoryModel.insert({value:history});
    
    H.resSuccess(res, value);
  }, () => {
    H.resFailure(res);
  });
});

PackageApi.get('/:id', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id;
  let {id} = req.params;
  
  PackageModel.get(id, (data) => {
    H.resSuccess(res, data);
  }, () => {
    H.resFailure(res);
  });
});

PackageApi.put('/:id', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id;
  let role = req._user.role;
  let {id} = req.params;
  let {prop, value} = req.body;
  // TODO: validate prop
  
  PackageModel.get(id, (data) => {
    if (!role && data.sid != uid && data.rid != uid)  return H.resUnauthorized(res);

    let params = {}; params[prop] = value;
    PackageModel.updateById(id, params, (result) => {
      H.resSuccess(res);
    }, () => { 
      H.resFailure(res); 
    });  
  }, () => {
    H.resFailure(res);
  });
});

PackageApi.put('/:id/status', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id;
  let role = req._user.role;
  let {id} = req.params;
  let {status, portal_id, note} = req.body;
  // TODO: validate
  
  PackageModel.get(id, (data) => {
    if (!role && data.sid != uid && data.rid != uid)  return H.resUnauthorized(res);

    let params = {status:status};
    PackageModel.updateById(id, params, (result) => {
      // Log package history
      let history = {pid:id, uid:uid, status:status, portal_id:portal_id, note:note};
      PackageHistoryModel.insert({value:history});  
      
      H.resSuccess(res);
    }, () => { 
      H.resFailure(res); 
    });  
  }, () => {
    H.resFailure(res);
  });
});

PackageApi.get('/:id/history', (req, res) => {
  let {id} = req.params;
  
  PackageHistoryModel.list({pid:id}, (data) => {
    H.resSuccess(res, data);
  }, () => {
    H.resFailure(res);
  });
});

module.exports = PackageApi;
