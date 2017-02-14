let ReceiverApi = require('express').Router();

import H from '../lib/helper';
import ReceiverModel from '../models/receiver_model';

ReceiverApi.post('', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let sid = req._user.id;
  let {first_name,last_name,state,city,address,email,phone} = req.body;
  let value = {sid:sid, first_name:first_name, last_name:last_name, state:state, city:city, address:address, email:email, phone:phone};
  // TODO: validate values
  
  ReceiverModel.insert({value:value}, (result) => {
    value.id = result.insertId;
    H.resSuccess(res, value);
  }, () => {
    H.resFailure(res);
  });
});

ReceiverApi.get('/mine', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id;
  let cond = {sid:uid};
  
  ReceiverModel.list(cond, (data) => {
    H.resSuccess(res, data);
  }, () => {
    H.resFailure(res);
  });
});

ReceiverApi.get('/:id', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id;
  let {id} = req.params;
  
  ReceiverModel.get(id, (data) => {
    if (data.sid != uid)  return H.resUnauthorized(res);
    
    H.resSuccess(res, data);
  }, () => {
    H.resFailure(res);
  });
});

ReceiverApi.put('/:id', (req, res) => {
  if(!req._user)  return H.resUnauthorized(res);
  
  let uid = req._user.id;
  let role = req._user.role;
  let {id} = req.params;
  let {prop, value} = req.body;
  
  ReceiverModel.get(id, (data) => {
    if (!role && data.sid != uid)  return H.resUnauthorized(res);

    let params = {}; params[prop] = value;
    ReceiverModel.updateById(id, params, (result) => {
      H.resSuccess(res);
    }, () => { 
      H.resFailure(res); 
    });  
  }, () => {
    H.resFailure(res);
  });
});

module.exports = ReceiverApi;
