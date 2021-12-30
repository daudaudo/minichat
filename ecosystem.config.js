module.exports = {
  apps: [{
    script: 'node ./bin/www',
    watch: '.',
    autorestart: false,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};