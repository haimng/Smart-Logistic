//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

import {ENV} from './config';

export class Env {
  constructor() {
    var _env = 'pro';

    if (typeof window !== 'undefined' && window._ENV && ENV[window._ENV] !== undefined) {
      _env = window._ENV;
    }
    else if (typeof process !== 'undefined' && process.env && process.env._ENV !== undefined && ENV[process.env._ENV] !== undefined) {
      _env = process.env._ENV;
    }

    console.log('_ENV: '+_env);
    this._env = _env;
  }
  
  get isPro() { return this._env == 'pro'; }
  get isLocal() { return this._env == 'local'; }
  
  get domain() { return ENV[this._env]['domain']; }
  get api_host() { return ENV[this._env]['api_host']; }
  get img_host() { return ENV[this._env]['img_host']; }
  get log_level() { return ENV[this._env]['log_level']; }
}

const env = new Env();
export default env;
