//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

export default class Pool {
  constructor() {
    this.pool = [];
    this.result = {};
  }
  
  // func: callback(key,value) => {};
  push(func) {
    this.pool.push(func);
  }
  
  run(callback) {
    var i = -1;
    let execute = () => {
      i++;
      if(i >= this.pool.length) {
        return callback(this.result);
      }
      
      this.pool[i]((key,value) => {
        if(key && value)  this.result[key] = value;
        execute();
      });  
    };
    execute();
  }
}