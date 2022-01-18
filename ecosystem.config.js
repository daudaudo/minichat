module.exports = {
  apps: [{
    script: 'npm start',
    autorestart: true,
  }, {
    script: 'npx tailwindcss -i public/stylesheets/build.css -o public/stylesheets/style.css --watch',
  }],
};