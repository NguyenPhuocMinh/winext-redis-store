'use strict';

const winext = require('winext');
const Promise = winext.require('bluebird');
const lodash = winext.require('lodash');
const chalk = winext.require('chalk');
const { get } = lodash;

function RedisClient(params = {}) {
  const client = get(params, 'client');
  const requestId = get(params, 'requestId');
  const loggerFactory = get(params, 'loggerFactory');
  const loggerTracer = get(params, 'loggerTracer');

  /**
   * Set key value with time expired into redis store
   * @param {*} key
   * @param {Number} seconds
   * @param {*} value
   */
  this.setSetex = async function ({ key, seconds, value }) {
    try {
      loggerFactory.info(`Func setSetex has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(
        chalk.green.bold(`Func setSetex has been start with key:${key}, seconds:${seconds}, value:${value}`)
      );

      await client.connect();

      client.setEx(key, seconds, value, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis setEx has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis setEx successfully with`, {
            requestId: `${requestId}`,
            args: reply,
          });
        }
      });

      loggerFactory.info(`Func setSetex has been end`, {
        requestId: `${requestId}`,
      });
    } catch (err) {
      loggerFactory.error(`Func setSetex has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Set key value into redis store
   * @param {*} key
   * @param {*} value
   */
  this.setOne = async function ({ key, value }) {
    try {
      loggerFactory.info(`Func setOne has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green.bold(`Func setOne has been start with ${key}-${value}`));
      await client.connect();

      client.set(key, value, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis set has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis set successfully with`, {
            requestId: `${requestId}`,
            args: reply,
          });
        }
      });

      loggerFactory.info(`Func setOne has been end`, {
        requestId: `${requestId}`,
      });
    } catch (err) {
      loggerFactory.error(`Func setOne has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Get key value from redis store
   * @param {*} key
   */
  this.getOne = async function ({ key }) {
    try {
      loggerFactory.info(`Func getOne has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green.bold(`Func getOne has been start with ${key}`));

      let result;

      await client.connect();

      client.get(key, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis get has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis get successfully!`, {
            requestId: `${requestId}`,
          });
          result = reply;
        }
      });

      loggerFactory.info(`Func getOne has been end`, {
        requestId: `${requestId}`,
      });

      return result;
    } catch (err) {
      loggerFactory.error(`Func getOne has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Get all key from redis store
   * @param {*} pattern
   */
  this.findAll = async function ({ pattern = '*' }) {
    try {
      loggerFactory.info(`Func findAll has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green.bold(`Func findAll has been start with ${pattern}`));

      let result;

      await client.connect();

      client.keys(pattern, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis keys has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis keys successfully!`, {
            requestId: `${requestId}`,
          });
          result = reply;
        }
      });

      loggerFactory.info(`Func findAll has been end`, {
        requestId: `${requestId}`,
      });

      return result;
    } catch (err) {
      loggerFactory.error(`Func findAll has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Save object to redis store
   * @param {*} key
   * @param {*} field
   * @param {*} value
   */
  this.setHashes = async function ({ key, field, value }) {
    try {
      loggerFactory.info(`Func setHashes has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(
        chalk.green.bold(`Func setHashes has been start with key:${key}-field:${field}-value:${value}`)
      );

      await client.connect();

      client.hSet(key, field, value, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis setHashes has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis setHashes successfully with`, {
            requestId: `${requestId}`,
            args: reply,
          });
        }
      });
    } catch (err) {
      loggerFactory.error(`Func setHashes has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Get object from redis store
   * @param {*} key
   */
  this.getHashes = async function ({ key }) {
    try {
      loggerFactory.info(`Func getHashes has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green.bold(`Func getHashes has been start with ${key}`));

      let result;

      await client.connect();

      client.hGetAll(key, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis getHashes has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis getHashes successfully!`, {
            requestId: `${requestId}`,
          });
          result = reply;
        }
      });

      loggerFactory.info(`Func getHashes has been end`, {
        requestId: `${requestId}`,
      });

      return result;
    } catch (err) {
      loggerFactory.error(`Func getHashes has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Delete one from redis store
   * @param {*} key
   */
  this.deleteOne = function ({ key }) {
    try {
      loggerFactory.info(`Func deleteOne has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green.bold(`Func deleteOne has been start with ${key}`));

      client.del(key, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis del has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis del successfully with`, {
            requestId: `${requestId}`,
            args: reply,
          });
        }
      });
    } catch (err) {
      loggerFactory.error(`Func deleteOne has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Delete all key from redis store
   * @param {*} mode
   */
  this.deleteAll = async function ({ mode }) {
    try {
      loggerFactory.info(`Func deleteAll has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green.bold(`Func deleteAll has been start with ${mode}`));

      await client.connect();

      return client.flushAll(mode, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis setHashes has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis setHashes successfully with`, {
            requestId: `${requestId}`,
            args: reply,
          });
        }
      });
    } catch (err) {
      loggerFactory.error(`Func deleteAll has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Create a list using into redis store
   * @param {*} key
   * @param {*} value
   */
  this.createOrPushIntoTop = async function ({ key, value }) {
    try {
      loggerFactory.info(`Func createOrPushIntoTop has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green.bold(`Func createOrPushIntoTop has been start with key:${key}-value:${value}`));

      await client.connect();

      client.lPush(key, value, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis lPush has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis lPush successfully with`, {
            requestId: `${requestId}`,
            args: reply,
          });
        }
      });
    } catch (err) {
      loggerFactory.error(`Func createOrPushIntoTop has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * Push a new item to the bottom of the list into redis store
   * @param {*} key
   * @param {*} value
   */
  this.pushIntoBottom = async function ({ key, value }) {
    try {
      loggerFactory.info(`Func pushIntoBottom has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green(`Func pushIntoBottom has been start with ${key}-${value}`));

      await client.connect();

      client.rPush(key, value, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis rPush has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis rPush successfully with`, {
            requestId: `${requestId}`,
            args: reply,
          });
        }
      });
    } catch (err) {
      loggerFactory.error(`Func pushIntoBottom has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };

  /**
   * List all the items in a list using from redis store
   * @param {*} key
   */
  this.findList = async function ({ key }) {
    try {
      loggerFactory.info(`Func findList has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green(`Func findList has been start with ${key}`));

      await client.connect();

      let result;

      client.lRange(key, 0, -1, (err, reply) => {
        if (err) {
          loggerFactory.error(`redis lRange has been error`, {
            requestId: `${requestId}`,
            args: err,
          });
        } else {
          loggerFactory.warn(`redis lRange successfully!`, {
            requestId: `${requestId}`,
          });
          result = reply;
        }
      });
      return result;
    } catch (err) {
      loggerFactory.error(`Func findList has been error: ${err}`, {
        requestId: `${requestId}`,
      });
      return Promise.reject(err);
    }
  };
}

exports = module.exports = new RedisClient();
exports.register = RedisClient;
