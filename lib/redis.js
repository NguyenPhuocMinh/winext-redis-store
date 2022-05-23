'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const redis = require('redis');
const { get } = lodash;

const profiles = require('../conf/profiles');

function RedisStore(params = {}) {
  const redisConfig = get(params, 'config.redis');
  const loggerTracer = get(params, 'loggerTracer');

  const enableRedis = get(redisConfig, 'enable', false);
  const portRedis = profiles.portRedis || get(redisConfig, 'port');
  const hostRedis = profiles.hostRedis || get(redisConfig, 'host');
  const usernameRedis = profiles.usernameRedis || get(redisConfig, 'username');
  const passwordRedis = profiles.passwordRedis || get(redisConfig, 'password');

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
          loggerTracer.error(`Start redis connection has error: ${err}`);
        }
      });
      await redisClient.connect();
      loggerTracer.info(`Redis connect complete`);
    } catch (err) {
      loggerTracer.error(`Start redis has been error: ${err}`);
      return Promise.reject(err);
    }
  };

  /**
   * Stop redis
   */
  this.stopRedis = async function () {
    try {
      loggerTracer.warn(`Redis has been close !!!`);
      await redisClient.disconnect();
    } catch (err) {
      loggerTracer.error(`Stop redis has been error: ${err}`);
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
