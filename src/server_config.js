//
//  Created by Hai Minh Nguyen
//  Copyright © 2017 VNDB Inc. All rights reserved.
//

export const ENV = {
  pro: {
    server_port: 3306,
    db: {
      default: {
        connectionLimit : 10,
        host     : 'tadu1',
        user     : 'smart-logistic',
        password : 'TODO',
        database : 'smart-logistic'
      }
    },
    fb: { // TODO
      app_id: '',
      app_secret: '',
    }, // TODO
    google: {
      client_id: '',
      client_secret: '',
      api_key: '',
      ga: '',
    },
    search: {
      host: 'tadu2:9200',
      index: 'smart-logistic',
      type: 'TODO',
    },
    mail: { // TODO
      host: '',
      port: 465,
      secure: true, 
      auth: {
        user: '',
        pass: ''
      },
      from: '',
    }
  },
  local: {
    server_port: 8082,
    db: {
      default: {
        connectionLimit : 1,
        host     : 'localhost',
        user     : 'dbuser',
        password : 'password',
        database : 'smart-logistic'
      }
    },
    fb: { // TODO
      app_id: '',
      app_secret: '',
    }, // TODO
    google: {
      client_id: '',
      client_secret: '',
      api_key: '',
      ga: '',
    },
    search: {
      host: 'vm:9200',
      index: 'smart-logistic',
      type: 'TODO',
    },
    mail: { // TODO
      host: '',
      port: 465,
      secure: true, 
      auth: {
        user: '',
        pass: ''
      },
      from: '',
    }
  }
}
