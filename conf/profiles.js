'use strict';

const winext = require('winext');
const dotenv = winext.require('dotenv');
dotenv.config();

const portRedis = process.env.REDIS_PORT;
const hostRedis = process.env.REDIS_HOST;

const usernameRedis = process.env.REDIS_USERNAME;
const passwordRedis = process.env.REDIS_PASSWORD;

const profiles = {
  portRedis,
  hostRedis,
  usernameRedis,
  passwordRedis,
};

module.exports = profiles;
