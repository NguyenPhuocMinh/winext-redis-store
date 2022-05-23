'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const chalk = winext.require('chalk');
const redis = require('redis');
const { get } = lodash;
const { name, version } = require('../package.json');

const profiles = require('../conf/profiles');

function RedisStore(params = {}) {
  const loggerFactory = get(params, 'loggerFactory');
  const loggerTracer = get(params, 'loggerTracer');

  const redisConfig = get(params, 'config.redis');
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
      loggerTracer.info(chalk.green.bold(`Load start redis by ${name}-${version} successfully!`));
      redisClient.on('error', (err) => {
        if (err) {
          loggerFactory.error(`Start redis connection has error: ${err}`);
        }
      });
      await redisClient.connect();
      loggerFactory.info(`Redis connect complete`);
    } catch (err) {
      loggerFactory.error(`Start redis has been error: ${err}`);
      return Promise.reject(err);
    }
  };

  /**
   * Stop redis
   */
  this.stopRedis = async function () {
    try {
      loggerTracer.warn(chalk.yellow.bold(`Load stop redis by ${name}-${version} successfully!`));
      loggerFactory.warn(`Redis has been close !!!`);
      await redisClient.disconnect();
    } catch (err) {
      loggerFactory.error(`Stop redis has been error: ${err}`);
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
