module.exports = {
  apps: [{
    script: 'node ./bin/serve > storage/logs/serve.log',
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