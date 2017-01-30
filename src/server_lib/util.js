import SanitizeHtml from 'sanitize-html';
//import ServerEnv from '../server_env';
//import H from '../lib/helper';
//import Log from '../lib/log';

class Util {
  sanitize(s) {
    if(typeof s == 'undefined')  return '';
    if(s === null)  return '';
    
    return SanitizeHtml(s, {
      allowedTags: ['span','br','b','i','u'], 
//      allowedAttributes: {img:['src']}
    });
  }

  sanitizeValue(value) {
    for(let k in value) {
      if(k.indexOf('id') >= 0 || ['rate','rc','lc','target','price','data','sex'].indexOf(k) >= 0)  continue;
      value[k] = this.sanitize(value[k]);
    }
    return value;
  }
}

const util = new Util();
export default util;
