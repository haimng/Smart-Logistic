var _ = require('lodash');

import Model from './model';
import UserModel from './user_model';
import H from '../lib/helper';
import Pool from '../lib/pool';

class NoticeModel extends Model {
 
  add(cond, notice, success, error) {
    super.add(cond, notice, () => {
      UserModel.increase(notice.uid,'nc');
      success();
    }, error);
  }
  
  insertValue(notice, success, error) {
    super.insertValue(notice, () => {
      UserModel.increase(notice.uid,'nc');
      if(success)  success();
    }, error);
  }
  
  select(opt, success, error) {
    super.select(opt, (data) => {
      if(data.length == 0)  return success(data);
      
      var pool = new Pool();
      pool.push((callback) => {
        this.getTarget(data, 'user', 'fid', 'id,display_name,avatar', callback);
      });
      pool.run((result) => {
        success(data);
      });
      
    }, () => {
      error();
    });
  }
  
}

var model = new NoticeModel();
export default model;