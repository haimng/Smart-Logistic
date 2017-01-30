//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

import Elasticsearch from 'elasticsearch';
import ServerEnv from '../server_env';

let _client = null;

class Search {
  
  get client() {
    if(!_client)  _client = new Elasticsearch.Client({ host: ServerEnv.search.host, log: ServerEnv.isPro ? 'error' : 'debug', apiVersion: '1.7' });
    return _client;
  }
  
  createIndex(body) {
    this.client.indices.create({ index: ServerEnv.search.index, body: body });  
  }
  
  deleteIndex() {
    this.client.indices.delete({ index: ServerEnv.search.index });  
  }
  
  mapping(config) {
    var body = {}; body[ServerEnv.search.type] = config;
    this.client.indices.putMapping({ index: ServerEnv.search.index, type: ServerEnv.search.type, body: body });  
  }
  
  index(body, callback) {
    this.client.index({ index: ServerEnv.search.index, type: ServerEnv.search.type,
      id: body.id,
      body: body
    }, (error, response) => {
      if(callback)  callback();
    });
  }
  
  deleteDoc(id) {
    this.client.delete({ index: ServerEnv.search.index, type: ServerEnv.search.type, id: id });  
  }
  
  search(keyword, matches, size, from, success, error) {
    var q = keyword || '';
    for(let f in matches) {
      let v = matches[f];
      q += (q ? ' AND ' : '') + f+':'+v;
    }
    if(!q)  q = 'cate_id:1';
    
    this.client.search({index: ServerEnv.search.index, type: ServerEnv.search.type,
      q: q,
      size: size,
      from: from,
//      body: {
//        query: {
//          match: {
//            name: 'bulbasaur'
//          }
//        }
//      }
      
    }).then((body) => {
      var hits = body.hits;
      var list = [];
      hits.hits.map((m) => {
        list.push(m._source);
      });
      
      var result = {
        total: hits.total,
        list: list
      };
      
      success(result);
      
    }, (err) => {
      console.trace(err.message);
      error();
    });
  }

  suggest(keyword, success, error) {
    var config = {};
    config[ServerEnv.search.type] = {
      text: keyword,
      completion: {
        field: 'suggest',
        fuzzy: {edit_distance: 1},
        size: 10
      }
    }; 
    
    this.client.suggest({index: ServerEnv.search.index, body: config})
    .then((body) => {
      var result = [];
      var list = body[ServerEnv.search.type];
      if(list && list[0] && list[0].options) {
        list[0].options.map((o) => {
          result.push(o.payload);
        });
      }
      success(result);
      
    }, (err) => {
      console.trace(err.message);
      error();
    });
  }
  
  // opt: id,size,from,mlt_fields
  similar(opt, success, error){
    var {id,size,from,mlt_fields} = opt;
    if(!id)  return error();
    if(!size)  size = 12;
    if(!from)  from = 0;
    if(!mlt_fields)  mlt_fields = 'name,keyword';
    
    this.client.mlt({index: ServerEnv.search.index, type: ServerEnv.search.type,
      id: id,
      mltFields: mlt_fields,
      searchSize: size,
      searchFrom: from,
      minDocFreq: 1,
      minTermFreq: 1,
    }).then((body) => {
      var result = [];
      var list = body.hits;
      if(list && list.hits) {
        list.hits.map((o) => {
          result.push(o._source);  
        });
      }
      success(result);
      
    }, (err) => {
      console.trace(err.message);
      error();
    });
  }
  
}

const search = new Search();
export default search;
