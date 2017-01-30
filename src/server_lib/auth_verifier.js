//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

var crypto = require('crypto');
//import RestApi from '../lib/rest_api';
import {FACEBOOK, GOOGLE} from '../const';

class AuthVerifier {
  constructor(provider, provider_id, secret, signed_request) {
    this.provider = provider;
    this.provider_id = provider_id;
    
    if(this.provider == FACEBOOK){
      this.secret = secret;
      this.request = signed_request;
      this.valid = false;

      var parts = this.request.split('.');
      if(parts.length >= 2) {
        this.encodedSignature = parts[0];
        this.encoded = parts[1];
        this.signature = this.base64decode(this.encodedSignature);
        this.decoded = this.base64decode(this.encoded);
        this.data = JSON.parse(this.decoded);  
        this.valid = true;
      }
    }
    else {
      this.client_id = secret;
      this.id_token = signed_request;  
    }
  }

  verify(success, error) {
    if(this.provider == FACEBOOK){
      this.verifyFacebook(success, error);
    }
    else {
      this.verifyGoogle(success, error);
    }
  }
  
  verifyGoogle(success, error) {
//    RestApi.request({
//      url: 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+encodeURIComponent(this.id_token),
//      external: true,
//      success: (result) => {
//        if(result.aud === this.client_id && result.sub === this.provider_id) {
//          success(result);  
//        }
//        else {
//          error();
//        }
//      },
//      error: (err) => {
//        console.log(err);
//        error();
//      }
//    });
  }

  verifyFacebook(success, error) {
    if(!this.valid)  return error();
    if(this.data.algorithm !== 'HMAC-SHA256')  return error();
    
    var hmac = crypto.createHmac('SHA256', this.secret);
    hmac.update(this.encoded);
    var result = hmac.digest('base64').replace(/\//g, '_').replace(/\+/g, '-').replace(/\=/g, '');
    if(result === this.encodedSignature && this.data && this.data.user_id === this.provider_id) {
      return success(this.data);
    }
    return error();
  }

  base64decode(data) {
    while(data.length % 4 !== 0) { data += '='; }
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    return new Buffer(data,'base64').toString('utf-8');
  }
}

module.exports = AuthVerifier;
