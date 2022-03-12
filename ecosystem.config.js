module.exports = {
  apps: [{
    script: 'npm start',
    autorestart: true,
    name: 'minichat:dev'
  }, {
    script: 'npx tailwindcss -i resource/css/main.css -o public/stylesheets/style.css --watch',
    name: 'minichat:watch-css'
  }],
};
