module.exports = {
  apps: [{
    script: 'npm start',
    autorestart: true,
    name: 'minichat:dev',
    watch: ['app', ],
    ignore_watch : ["node_modules", "resource"],
  }, {
    script: 'npx tailwindcss -i resource/css/main.css -o public/stylesheets/style.css --watch',
    name: 'minichat:watch-css'
  }],
};
