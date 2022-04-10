'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const dotenv = winext.require('dotenv');
const chalk = winext.require('chalk');
const redis = require('redis');
const redisClient = require('../store/redisClient');
const { get } = lodash;
const { name, version } = require('../package.json');

function RedisStore(params = {}) {
  const requestId = get(params, 'requestId');
  const loggerFactory = get(params, 'loggerFactory');
  const loggerTracer = get(params, 'loggerTracer');
  // config env
  dotenv.config();

  const redisConfig = get(params, 'config.redis');
  const enableRedis = get(redisConfig, 'enable', false);
  const hostRedis = process.env.REDIS_HOST || get(redisConfig, 'host');
  const portRedis = process.env.REDIS_PORT || get(redisConfig, 'port');
  const usernameRedis = process.env.REDIS_USERNAME || get(redisConfig, 'username');
  const passwordRedis = process.env.REDIS_PASSWORD || get(redisConfig, 'password');

  const client = enableRedis
    ? redis.createClient({
        url: `redis://${usernameRedis}:${passwordRedis}@${hostRedis}:${portRedis}`,
      })
    : redis.createClient(portRedis, hostRedis);

  /**
   * Start redis
   */
  this.startRedis = async function () {
    try {
      client.on('error', (err) => {
        loggerFactory.error(`Start redis connection has error`, {
          requestId: `${requestId}`,
          args: err,
        });
      });
      loggerTracer.info(chalk.green.bold(`Load redis by ${name}-${version} successfully!`));
      loggerFactory.info(`Redis connect complete`, {
        requestId: `${requestId}`,
        args: !enableRedis ? `${hostRedis}:${portRedis}` : '',
      });
      await client.connect();
    } catch (err) {
      loggerFactory.error(`Start redis has been error: ${err}`, {
        requestId: `${requestId}`,
        args: err,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Stop redis
   */
  this.stopRedis = async function () {
    try {
      loggerFactory.data(`Redis has been close`, {
        requestId: `${requestId}`,
      });
      await client.disconnect();
    } catch (err) {
      loggerFactory.error(`Stop redis has been error: ${err}`, {
        requestId: `${requestId}`,
        args: err,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Redis
   */
  this.redis = redis;

  /**
   * Client
   */
  this.client = client;

  /**
   * Redis client
   */
  const redisClientParams = {
    client: client,
    requestId: requestId,
    loggerFactory: loggerFactory,
    loggerTracer: loggerTracer,
  };

  this.redisClient = redisClient.register(redisClientParams);
}

exports = module.exports = new RedisStore();
exports.register = RedisStore;
