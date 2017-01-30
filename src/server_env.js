//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

import {Env} from './env';
import {ENV} from './server_config';

class ServerEnv extends Env {
  get server_port() { return ENV[this._env]['server_port']; }
  get db() { return ENV[this._env]['db']; }
  get aws() { return ENV[this._env]['aws']; }
  get fb() { return ENV[this._env]['fb']; }
  get google() { return ENV[this._env]['google']; }
  get search() { return ENV[this._env]['search']; }
  get mail() { return ENV[this._env]['mail']; }
}

const server_env = new ServerEnv();
export default server_env;
