'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const dotenv = winext.require('dotenv');
const chalk = winext.require('chalk');
const redis = require('redis');
const { get } = lodash;
const { name, version } = require('../package.json');

function RedisStore(params = {}) {
  // config env
  dotenv.config();

  const config = get(params, 'config');
  const requestId = get(params, 'requestId');
  const loggerFactory = get(params, 'loggerFactory');
  const loggerTracer = get(params, 'loggerTracer');
  const errorManager = get(params, 'errorManager');

  this.connection = async function (app, router) {
    loggerFactory.info(`Redis connection has been start`, {
      requestId: `${requestId}`
    });
  };
}

exports = module.exports = new RedisStore();
exports.register = RedisStore;
