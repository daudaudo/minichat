module.exports = {
  apps: [{
    script: 'npm start',
    watch: true,
    autorestart: true,
    env: {
      NODE_ENV: 'development',
    },
  }, {
    script: 'npx tailwindcss -i public/stylesheets/build.css -o public/stylesheets/style.css --watch',
  }],
};