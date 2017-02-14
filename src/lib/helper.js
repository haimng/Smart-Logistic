//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

import ObjectAssign from './object_assign';
import Env from '../env';
import Log from './log';
import DateFormat from 'dateformat';

const RES_ERROR = { 
  400: 'Error',
  401: 'Unauthorized',
  404: 'Not found',
};

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.include = function(s) {
  return this.indexOf(s) >= 0;
};

String.prototype.hasPrefix = function(s) {
  return this.indexOf(s) === 0;
};

class Helper {
  
  parseQuery(q) {
    if(!q)  return {};
    return q.replace(/(^\?)/,'').split("&").map(function(n){return n = n.split("="),this[n[0]] = n[1],this}.bind({}))[0];
  }

  sortArrayBy(array, order, asc) {
    var sortByOrder = (a,b) => {
      var a_order = a[order] != undefined ? a[order] : 999;
      var b_order = b[order] != undefined ? b[order] : 999;
      return a_order < b_order ? -asc : (a_order > b_order ? asc : 0);
    };
    return array.sort(sortByOrder);
  }

  cap(str) {
    str = str.replace('_',' ');
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  isNumeric(str){
    return /^\d+$/.test(str);
  }
  
  correctUrl(url) {
    if(!url)  return '';
    if(url.hasPrefix('//'))  url = 'http:'+url;
    return url;
  }
  
  avatarUrl(url, size) {
    if(!url)  return '/img/avatar.png';
    if(url.indexOf("googleusercontent.com") > 0)  url = url.indexOf("sz=50") > 0 ? url.replace(/sz=50/,'sz=320') : url+'?sz=320';
    
    return this.photoUrl(url, size);
  }
  
  formatDate(date, format) {
    if(!date)  return '';
    try {
      var d = new Date(date);
      return DateFormat(d, format);  
    }catch(e) {
      return ''
    }
  }
  
  simpleDatetime(date) {
    return this.formatDate(date, "m/d h:MM:ss");
  }
  
  simpleDate(date) {
    return this.formatDate(date, "d_mmm");
  }
  
  simpleTime(date) {
    return this.formatDate(date, "h:MM:ss");
  }
  
  timeToDateString(date, format) {
    var d = new Date(date);
    var options = format || { year: 'numeric', month: 'short', day: 'numeric' }
    // TODO: local
    return d.toLocaleDateString('en-US', options);
  }

  timeAgo(date) {
    var since = '';
    if (date) {
      var time = new Date(date);
      var currTime = new Date();
      var diffSec = (currTime.getTime() - time.getTime()) / 1000;
      var oneMin = 60;
      var oneHour = oneMin * 60;
      var oneDay = oneHour * 24;
      var oneWeek = oneDay * 7;
      var oneMonth = oneDay * 30;
      var oneYear = oneDay * 365;

      if (diffSec > oneYear) {
        var num = parseInt(diffSec / oneYear);
        since = num + (num > 1 ? " years" : " year") + " ago";
      }
      else if (diffSec > oneMonth) {
        var num = parseInt(diffSec / oneMonth);
        since = num + (num > 1 ? " months" : " month") + " ago";
      }
      else if (diffSec > oneWeek) {
        var num = parseInt(diffSec / oneWeek);
        since = num + (num > 1 ? " weeks" : " week") + " ago";
      }
      else if (diffSec > oneDay) {
        var num = parseInt(diffSec / oneDay);
        since = num + (num > 1 ? " days" : " day") + " ago";
      }
      else if (diffSec > oneHour) {
        var num = parseInt(diffSec / oneHour);
        since = num + (num > 1 ? " hours" : " hour") + " ago";
      }
      else if (diffSec > oneMin) {
        var num = parseInt(diffSec / oneMin);
        since = num + (num > 1 ? " minutes" : " minute") + " ago";
      }
      else if (diffSec >= 1) {
        var num = parseInt(diffSec % oneMin);
        since = num + (num > 1 ? " seconds" : " second") + " ago";
      }
    }
    return since;
  }

  timeLeft(date, options) {
    var since = '';
    if (date) {
      var time = new Date(date);
      var currTime = new Date();
      var totalSec = (time.getTime() - currTime.getTime()) / 1000;

      var days = parseInt( totalSec / (3600 * 24) );
      var hours = parseInt( totalSec / 3600 ) % 24;
      var minutes = parseInt( totalSec / 60 ) % 60;
      var seconds = parseInt(totalSec % 60);

      since = days == 0 ? "" : (days + (days > 1 ? " days " : " day "));
      if (since == "") {
        since = since + (hours < 10 ? "0" + hours : hours) + " hr " + (minutes < 10 ? "0" + minutes : minutes) + " min " + (seconds  < 10 ? "0" + seconds : seconds) + " sec";
      }
      else {
        since = since + (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
      }
    }
    return since;
  }

  hourPassed(date) {
    var diffHour = 0;
    if(date){
      var time = new Date(date);
      var currTime = new Date();
      diffHour = (currTime.getTime() - time.getTime()) / 1000 / 60;
    }
    return diffHour;
  }

  get currentTime() {
    return (new Date()).getTime();
  }
  
  get currentDateTime() {
    return this.formatDate(new Date(), "yyyy/m/d h:MM:ss");
  }

  stripHtml(html) {
     if (typeof document !== 'undefined') {
       var tmp = document.createElement("DIV");
       tmp.innerHTML = html;
       return tmp.textContent || tmp.innerText || "";
     }
     else {
       var regex = /(<([^>]+)>)/ig;
       return html.replace(regex, "");
     }
  }

  clone(obj) { return ObjectAssign({}, obj); }

  isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))  return false;
    }
    return true;
  }
  
  notEmpty(obj) {
    return !this.isEmpty(obj);
  }
  
  merge(defaults, options) {
    let new_options = {};
    for (let attrname in defaults) { new_options[attrname] = defaults[attrname]; }
    for (let attrname in options) { new_options[attrname] = options[attrname]; }
    return new_options;
  }
  
  logRequest(req) {
    if(Env.isLocal)  Log.info();
    Log.info((new Date()).toJSON(), req.method, req.originalUrl, req.headers['user-agent'] || '');
//    Log.info(req.headers);
  }
  
  endsWith(str, suffix) {
    return str && str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  randInt(min, max) {
    return Math.ceil(Math.random() * (max - min)) + min;
  }
  
  urlEncode(str) {
    return encodeURIComponent(str);  
  }
  
  l(s,a) {
    return s;
  }
  
  // safely escape JSON for embedding in a <script> tag
  safeStringify(obj) {
    return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
  }
  
  /*** Request / Response ***/
  resSuccess(res, data) {
    data = data || '';
    res.status(200).json({status: "SUCCESS", data: data});
  }
  
  resFailure(res, code, err) {
    code = code || 400;
    err = err || RES_ERROR[code];
    res.status(code).json({status: "FAILURE", error: {code: code, message: err}});
  }
  
  resInvalid(res, err) { this.resFailure(res, 400, err); }
  resUnauthorized(res) { this.resFailure(res, 401); }
  resNotfound(res) { this.resFailure(res, 404); }
  
  sessionUser(session) {
    var user = JSON.parse(session.data);
    if(user && user.id) {
      if(!user.avatar)  user.avatar = '/img/avatar.png';
      return user;
    }
    return null;
  }
  
  /*** Validations ***/
  validateSignup(user) {
    for(let f in user) { user[f] = user[f] ? user[f].trim() : ''; }
    
    var err = '';
    var emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    
    if(!user.email){ err = this.l("Email address is empty."); }
    if(!emailRegex.test(user.email)){ err = this.l("Email format is not correct."); }
    if(!user.last_name){ err = this.l("Last name is empty."); }
    if(!user.first_name){ err = this.l("First name is empty."); }
    if(user.password.length < 8 || user.password.length > 20){ err = this.l("Password must be 8-20 characters."); }
    
    if(err)  user.err = err;
    return user;
  }
  
  filterFields(data, fields) {
    var new_data = {};
    for(let f in data) { if(fields.indexOf(f) >= 0)  new_data[f] = data[f]; }
    return new_data;
  }
  
  /*** Shell ***/
  // func: (id,next)
  execute(from, to, func) {
    var id = from-1;
    let run = () => {
      id++;
      if(id > to) {
        setTimeout(() => { process.exit(); }, 3000);
        return ;
      }
      
      func(id,run);
    };
    run();
  }
  
}

const helper = new Helper();
export default helper;
