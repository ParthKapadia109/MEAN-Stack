'use strict';
const _ = require('lodash');

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV,

  base_url : process.env.BASE_URL
};

// Export the config object based on the NODE_ENV
// ==============================================
var environment = process.env.NODE_ENV || 'development';
console.log("Environment: ", environment);
module.exports = _.merge(
  all,
  require('./' + environment + '.js') || {},
  requiredProcessEnv
);