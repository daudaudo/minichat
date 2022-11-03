module.exports = {
  apps: [{
    script: 'npm start >> storage/logs/app.log 2>&1',
    autorestart: true,
    name: 'minichat:dev',
  }, {
    script: 'npx tailwindcss -i resource/css/main.css -o public/stylesheets/style.css --watch',
    name: 'minichat:watch-css'
  }],
};
