import Model from './model';
import Bcrypt from 'bcrypt-nodejs';
import Sha1 from 'sha1';
import ServerEnv from '../server_env';
import H from '../lib/helper';

const SHA_SALT = ServerEnv.isPro ? 'uj6G93b0123fIxfs2guVoUubWwvniR2G0FgaC9mi' : 'dYhG93b0qy123x321guVoUubWwvniR2G0FgaC9mi';

export class UserModel extends Model {
  
  signup(user, success, error) {
    this.find({email: user.email, provider: ''}, 
      (result) => { 
        error(H.l("The email address is already used.")); 
      }, 
      () => {
        user.password = Bcrypt.hashSync(user.password);
        super.insert({ value: user }, 
          (result) => {
            user.id = result.insertId;
            delete user.password;
            success(user);
          },
          () => { 
            error();
          });
      });
  }
  
  signin(data, success, error) {
    this.find({email: data.email, provider: ''},
      (user) => { 
        // bcrypt
        if(user.password.indexOf('$2') == 0) {
          if(!Bcrypt.compareSync(data.password, user.password))  return error(H.l("Password is not correct."));
        }
        // sha1
        else {
          var password = `${SHA_SALT}${data.password}`;
          if(Sha1(password) != user.password)  return error(H.l("Password is not correct."));
          
          // Switch password to bcrypt
          this.updateById(user.id, {password:Bcrypt.hashSync(data.password)}, () => {}, () => {});
        }
        
        delete user.password;
        success(user);
      }, 
      () => {
        error(H.l("Email is not correct."));
      });
  }
  
  login(user, success, error) {
    this.find({provider: user.provider, provider_id: user.provider_id}, 
      (result) => { 
        delete result.password;
        success(result, false); 
      }, 
      () => { 
        // Register
        super.insert({ value: user }, 
          (result) => {
            user.id = result.insertId;
            delete user.password;
            delete user.provider;
            delete user.provider_id;
            success(user, true);
          },
          () => { 
            error();
          });
      });
  }
  
}

var model = new UserModel();
export default model;