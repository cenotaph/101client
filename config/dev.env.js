'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_PATH: '"http://localhost:3073"'
  // API_PATH: '"http://api.testing.icewhistle.com"'
})
