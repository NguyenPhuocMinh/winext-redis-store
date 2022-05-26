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
  const redisUrl = enableRedis
    ? `redis://${usernameRedis}:${passwordRedis}@${hostRedis}:${portRedis}`
    : `redis://${hostRedis}:${portRedis}`;

  const redisClient = redis.createClient({ url: redisUrl, legacyMode: true });

  /**
   * Start redis
   */
  this.startRedis = async function () {
    try {
      loggerTracer.info(`Redis has been start !!!`);
      redisClient.on('error', (err) => {
        if (err) {
          loggerTracer.error(`Start redis connection has error`, {
            args: err,
          });
          throw err;
        }
      });
      await redisClient.connect();
      loggerTracer.http(`Redis connect complete on`, {
        args: `[${redisUrl}]`,
      });
    } catch (err) {
      loggerTracer.error(`Start redis has been error`, {
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
      loggerTracer.warn(`Redis has been close !!!`);
      await redisClient.disconnect();
    } catch (err) {
      loggerTracer.error(`Stop redis has been error`, {
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
   * Redis client
   */
  this.redisClient = redisClient;
}

exports = module.exports = new RedisStore();
exports.register = RedisStore;
