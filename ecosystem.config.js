module.exports = {
  apps: [{
    script: 'node ./bin/serve',
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