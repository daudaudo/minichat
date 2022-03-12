module.exports = {
  apps: [{
    script: './bin/serve',
    autorestart: true,
    name: 'minichat:server-production'
  }],
};
