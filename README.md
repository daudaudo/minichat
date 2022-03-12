# Minichat Nodejs

## Docker

- To start working environment, please run `docker-composer up -d`
- To access nodejs app, access address `http://localhost:3001`

## Install

- copy file .env.example file to .env file
- run `docker-compose exec app sh` in the project root directory
- run `npm install`
- run `npm run build:css`
- run `npm run resource:complie`
- run `npm run storage:link`
- run `pm2 start ecosystem.config.js` on development
- or run `pm2 start deploy.ecosystem.config.js` on production
