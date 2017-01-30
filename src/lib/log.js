//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

import Env from '../env';

const LOG_LEVEL = { error: 0, info: 1, debug: 2 };

class Log {
  constructor() {
    this._log_level = LOG_LEVEL[Env.log_level];
    this._noop = ()=>{};
    this._console = console || {};
    for(let level in LOG_LEVEL){
      if(!this._console[level])  this._console[level] = this._console.log || this._noop; 
    }
  }
  
  error() {
    if(this._log_level < LOG_LEVEL['error'])  return;
    this._console.error.apply(this._console, arguments);
  }
  
  info() {
    if(this._log_level < LOG_LEVEL['info'])  return;
    this._console.info.apply(this._console, arguments);
  }
  
  debug() {
    if(this._log_level < LOG_LEVEL['debug'])  return;
    this._console.debug.apply(this._console, arguments);
  }
}

const log = new Log();
export default log;
