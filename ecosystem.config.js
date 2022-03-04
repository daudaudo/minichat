module.exports = {
  apps: [{
    script: 'npm start',
    autorestart: true,
  }, {
    script: 'npx tailwindcss -i resource/css/main.css -o public/stylesheets/style.css --watch',
  }],
};