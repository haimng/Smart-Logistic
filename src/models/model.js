//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

let MySQL = require('mysql');
let _ = require('lodash');

import Util from '../server_lib/util';
import ServerEnv from '../server_env';
import H from '../lib/helper';
import Log from '../lib/log';

const OPERATORS = { '_gte': '>=', '_lte': '<=', '_gt': '>', '_lt': '<', '_like': 'LIKE', '_in': 'IN' };

let _pool = {};

export default class Model {
  constructor() {
    this._db = 'default';
    this._table = this.constructor.name.slice(0,-5).toLowerCase();
  }
  
  get pool() {
    if(!_pool[this._db]) {
      _pool[this._db] = MySQL.createPool(ServerEnv.db[this._db]);
    }
    return _pool[this._db];
  }
  
  query(sql, success, error) {
    Log.debug(sql);
    if(!success)  success = (x)=>{};
    if(!error)  error = ()=>{};
    
    this.pool.getConnection((err, connection) => {
      if(err) { Log.error('Model:connect:err:',err); error(); return; }
      
      connection.query(sql, (err, result) => {
        connection.release();
        if(err) { Log.error('Model:query:err:',err); error(); return; }
        
//        Log.debug('Model:query:result:',JSON.stringify(result));
        success(result);
      });
    });
  }
  
  select(opt, success, error) {
    // opt: {cond: {'id_gte': 1}, value, fields, order: 'id asc', limit, offset}
    Log.debug('Model:select:opt:', opt);
    
    var params = [this._table];
    var fields = opt.fields || '*';
    var sql = "SELECT "+fields+" FROM ??";
    if(opt.cond){
      let is_first = true;
      for(let f in opt.cond){
        let v = opt.cond[f];
        let o = '=';
        let v_f = '?';
        
        for(let k in OPERATORS) {
          if(H.endsWith(f,k)) {
            f = f.replace(k,'');
            o = OPERATORS[k];
            break;
          }
        }
        
        if(o == 'IN') {
          if(v.length == 1) { o = '='; v = v[0]; }
          else { v = `(${v.join(',')})`;  v_f = v; }
        }
        
        var c = '?? '+o+' '+v_f;
        
        if(f == 'OR') {
          var or = [];
          v.map((v1) => {
            var and = [];
            for(let f2 in v1) {
              let v2 = v1[f2];
              and.push('?? = ?');
              params.push(f2);
              params.push(v2);
            }
            or.push('('+and.join(' AND ')+')');
          });
          c = '('+or.join(' OR ')+')';
        }
        else if(v == 'NULL') {
          c = '?? IS NULL';
          params.push(f);
        }
        else if(v == 'NOT_NULL') {
          c = '?? IS NOT NULL';
          params.push(f);
        }
        else {
          params.push(f);
          params.push(v);
        }
        
        if(is_first) {
          sql += ' WHERE '+c;
          is_first = false;
        }else{
          sql += ' AND '+c;
        }
      }
    }
    if(opt.order) {
      sql += ' ORDER BY ' + opt.order;
    }
    if(opt.limit) {
      sql += ' LIMIT ?';
      var limit = parseInt(opt.limit);
      if(limit < 1)  limit = 1;
      if(limit > 200)  limit = 200; 
      params.push(limit);
    }
    if(opt.offset) {
      sql += ' OFFSET ?';
      var offset = parseInt(opt.offset);
      if(offset < 0)  offset = 0;
      params.push(offset);
    }
    sql = MySQL.format(sql, params);
    
    this.query(sql, success, error);
  }
  
  insert(opt, success, error) {
    // opt: {value}
    // result: insertId
    Log.debug('Model:insert:opt:', opt);
    
    var value = Util.sanitizeValue(opt.value);
    var params = [this._table, value];
    var sql = "INSERT INTO ?? SET ?";
    sql = MySQL.format(sql, params);
    
    this.query(sql, success, error);
  }
  
  insertValue(value, success, error) {
    this.insert({value:value}, success, error);
  }
  
  update(opt, success, error) {
    // opt: {cond, value}
    Log.debug('Model:update:opt:', opt);
    
    var value = Util.sanitizeValue(opt.value);
    var params = [this._table, value];
    var sql = "UPDATE ?? SET ?";
    
    var is_first = true;
    for(let f in opt.cond){
      let v = opt.cond[f];
      let o = '=';
      
      if(is_first) {
        sql += ' WHERE ?? '+o+' ?';
        is_first = false;
      }else {
        sql += ' AND ?? '+o+' ?';
      }
      
      params.push(f);
      params.push(v);
    }

    sql = MySQL.format(sql, params);
    
    this.query(sql, success, error);
  }
  
  updateById(id, value, success, error) {
    this.update({ cond: {id:id}, value: value }, success, error);
  }
  
  updateIfExist(cond, value, success, error) {
    var id = null;
    var data = null;
    let _success = (result) => {
      id = id || result.insertId;
      success(id, data);
    }; 
    
    this.find(cond, (result) => {
      data = result;
      id = data.id;
      this.update({cond: cond, value: value}, _success, error);
    }, () => {
      this.insert({value: value}, _success, error);
    });
  }
  
  increase(id, field, success, error) {
    var params = [this._table, field, field, id];
    var sql = "UPDATE ?? SET ?? = ??+1 WHERE id=?";
    sql = MySQL.format(sql, params);
    this.query(sql, success, error);
  }
  
  remove(cond, success, error) {
    Log.debug('Model:remove:cond: ',cond);
    
    var params = [this._table];
    var sql = "DELETE FROM ??";
    
    var is_first = true;
    for(let f in cond){
      let v = cond[f];
      let o = '=';
      
      if(is_first) {
        sql += ' WHERE ?? '+o+' ?';
        is_first = false;
      }else {
        sql += ' AND ?? '+o+' ?';
      }
      
      params.push(f);
      params.push(v);
    }

    sql = MySQL.format(sql, params);
    
    this.query(sql, success, error);
  }
  
  get(id, success, error) {
    this.select({ cond: {id: id}, limit: 1 },
      (result) => { 
        if(result.length > 0)  return success(result[0]);
        error();
      },
      () => { 
        error(); 
      });  
  }
  
  find(cond, success, error) {
    this.select({ cond: cond, limit: 1 },
      (result) => { 
        if(result.length > 0)  return success(result[0]);
        error();
      },
      () => { 
        error(); 
      });  
  }
  
  add(cond, value, success, error) {
    this.find(cond, 
      (result) => { error(); }, 
      () => {
        this.insert({ value: value }, 
          (result) => {
            success(result);
          },
          () => { 
            error(); 
          });
      });
  }
  
  list(cond, success) {
    this.select({ cond: cond },
      (result) => { 
        success(result);
      },
      () => { 
        success([]); 
      });
  }

  getTarget(data, target, id_name, fields, callback) {
    let ids = data.map((d) => { return d[id_name]; });
    let TargetModel = require(`../models/${target}_model`)[`${H.cap(target)}Model`];
    let targetModel = new TargetModel();
    targetModel.select({cond:{'id_in':ids}, fields:fields}, (items) => {
      items = _.keyBy(items,'id');
      data.map((d) => { let i = items[d[id_name]]; if(i)  d[target] = i; });
      callback();
    }, () => {
      callback();
    });
  }
  
} 
