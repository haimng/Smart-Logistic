var _ = require('lodash');

import H from '../lib/helper';
import Pool from '../lib/pool';
import Model from './model';

export class FriendModel extends Model {
  
  add(cond, friend, success, error) {
    super.add(cond, friend, success, error);
    
    friend = cond = {uid:friend.fid, fid:friend.uid};
    super.add(cond, friend, ()=>{}, ()=>{});
  }
  
  select(opt, success, error) {
    super.select(opt, (data) => {
      if(data.length == 0)  return success(data);
      
      var pool = new Pool();
      pool.push((callback) => {
        super.getTarget(data, {target:'user', id_name:'fid', fields:'id,display_name,avatar'}, callback);
      });
      pool.run((result) => {
        data = data.map((f) => { return f.user; });
        success(data);
      });
      
    }, () => {
      error();
    });
  }
  
}

var model = new FriendModel();
export default model;