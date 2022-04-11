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

      return client.setEx(key, seconds, value);
    } catch (err) {
      loggerFactory.error(`Func setSetex has been error : ${err}`, {
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
      loggerTracer.info(chalk.green(`Func setOne has been start with ${key}-${value}`));

      return client.set(key, value);
    } catch (err) {
      loggerFactory.error(`Func setOne has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
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
      loggerTracer.info(chalk.green(`Func getOne has been start with ${key}`));

      return client.get(key);
    } catch (err) {
      loggerFactory.error(`Func getOne has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
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
  this.setHashes = function ({ key, field, value }) {
    try {
      loggerFactory.info(`Func setHashes has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green(`Func setHashes has been start with ${key}-${field}-${value}`));

      return client.hSet(key, field, value);
    } catch (err) {
      loggerFactory.error(`Func setHashes has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
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
      loggerTracer.info(chalk.green(`Func getHashes has been start with ${key}`));

      return client.hGetAll(key);
    } catch (err) {
      loggerFactory.error(`Func getHashes has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
      });
      return Promise.reject(err);
    }
  };

  /**
   * Delete key value from redis store
   * @param {*} key
   */
  this.deleteAll = async function ({ key }) {
    try {
      loggerFactory.info(`Func deleteAll has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green(`Func deleteAll has been start with ${key}`));

      return client.del(key);
    } catch (err) {
      loggerFactory.error(`Func deleteAll has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
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
      loggerTracer.info(chalk.green(`Func createOrPushIntoTop has been start with ${key}-${value}`));

      return client.lPush(key, value);
    } catch (err) {
      loggerFactory.error(`Func createOrPushIntoTop has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
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

      return client.rPush(key, value);
    } catch (err) {
      loggerFactory.error(`Func pushIntoBottom has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
      });
      return Promise.reject(err);
    }
  };

  /**
   * List all the items in a list using from redis store
   * @param {*} key
   */
  this.findAll = async function ({ key }) {
    try {
      loggerFactory.info(`Func findAll has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green(`Func findAll has been start with ${key}`));

      const result = await client.lRange(key, 0, -1);
      return result;
    } catch (err) {
      loggerFactory.error(`Func findAll has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
      });
      return Promise.reject(err);
    }
  };

  /**
   * Drop items from a list using using from redis store
   * @param {*} key
   */
  this.deleteOne = function ({ key }) {
    try {
      loggerFactory.info(`Func deleteOne has been start`, {
        requestId: `${requestId}`,
      });
      loggerTracer.info(chalk.green(`Func deleteOne has been start with ${key}`));

      return client.rPop(key);
    } catch (err) {
      loggerFactory.error(`Func deleteOne has been error : ${err}`, {
        requestId: `${requestId}`,
        args: { err },
      });
      return Promise.reject(err);
    }
  };
}

exports = module.exports = new RedisClient();
exports.register = RedisClient;
