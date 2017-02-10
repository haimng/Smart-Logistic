import Model from './model';
import H from '../lib/helper';

const DATA_FIELDS = ['id','first_name','last_name','display_name','avatar','role'];

class SessionModel extends Model {
  
  add(id, user, success, error) {
    var data = H.filterFields(user, DATA_FIELDS);
    var value = { id: id, data: JSON.stringify(data) };
    super.insert({ value: value }, 
      (result) => {
        success(result);
      },
      () => { 
        error();
      });
  }
  
  updateById(id, user, success, error) {
    var data = H.filterFields(user, DATA_FIELDS);
    super.updateById(id, { data: JSON.stringify(data) }, 
      (result) => {
        success(result);
      },
      () => { 
        error();
      });
  }
  
}

var model = new SessionModel();
export default model;
