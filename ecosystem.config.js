module.exports = {
  apps: [{
    script: './bin/serve',
    watch: '.',
    autorestart: false,
    env: {
      NODE_ENV: 'development',
    },
  }, {
    script: 'npx tailwindcss -i public/stylesheets/tailwind.css -o public/stylesheets/style.css --watch',
  }],
};