module.exports = {
  apps: [{
    script: './bin/serve',
    watch: '.',
    autorestart: false,
    env: {
      NODE_ENV: 'development',
    },
  }],
};