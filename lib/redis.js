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

  const redisClient = enableRedis
    ? redis.createClient({
        url: `redis://${usernameRedis}:${passwordRedis}@${hostRedis}:${portRedis}`,
        legacyMode: true,
      })
    : redis.createClient({ legacyMode: true });

  /**
   * Start redis
   */
  this.startRedis = async function () {
    try {
      redisClient.on('error', (err) => {
        if (err) {
          loggerFactory.error(`Start redis connection has error: ${err}`, {
            requestId: `${requestId}`,
          });
        } else {
          loggerTracer.info(chalk.green.bold(`Load start redis by ${name}-${version} successfully!`));
          loggerFactory.info(`Redis connect complete`, {
            requestId: `${requestId}`,
          });
        }
      });
    } catch (err) {
      loggerFactory.error(`Start redis has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Stop redis
   */
  this.stopRedis = async function () {
    try {
      loggerTracer.warn(chalk.yellow.bold(`Load stop redis by ${name}-${version} successfully!`));
      loggerFactory.warn(`Redis has been close !!!`, {
        requestId: `${requestId}`,
      });
      await redisClient.disconnect();
    } catch (err) {
      loggerFactory.error(`Stop redis has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Redis
   */
  this.redis = redis;

  /**
   * Redis client
   */
  this.redisClient = redisClient;
}

exports = module.exports = new RedisStore();
exports.register = RedisStore;
