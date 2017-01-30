var UtilApi = require('express').Router();

import H from '../lib/helper';

UtilApi.get('/ping', (req, res) => {
  H.resSuccess(res);
});

module.exports = UtilApi;
