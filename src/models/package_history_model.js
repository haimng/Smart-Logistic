import Model from './model';
import Pool from '../lib/pool';

import {USER_FIELDS} from '../const';

export class PackageHistoryModel extends Model {
  
  select(opt, success, error) {
    super.select(opt, (data) => {
      if(data.length == 0)  return success(data);
      
      let pool = new Pool();
      pool.push((callback) => {
        super.getTarget(data, {target:'package', id_name:'pid'}, callback);
      });
      pool.push((callback) => {
        super.getTarget(data, {target:'user', id_name:'portal_id', map_name:'portal', fields:USER_FIELDS}, callback);
      });
      pool.run((result) => {
        success(data);
      });
      
    }, () => {
      error();
    });
  }
  
}

let model = new PackageHistoryModel();
export default model;