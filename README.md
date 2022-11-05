# Minichat Nodejs

## Docker

- To start working environment, please run `docker-compose up -d`
- To access nodejs app, access address `http://localhost:3001`

## Install

- copy file .env.example file to .env file
- run `docker-compose exec app sh` in the project root directory
- run `npm install`
- run `npm run build:css`
- run `npm run resource:complie`
- run `npm run storage:link`
- run `npm run create:admin` to create admin account
- run `pm2 start ecosystem.config.js` on development
- or run `pm2 start deploy.ecosystem.config.js` on production

## Reverse Proxy and Load Balancer

```
  upstream nodes {
    hash $remote_addr consistent;
    server 0.0.0.0:3001;
    server 0.0.0.0:3001;
    server 0.0.0.0:3001;
    server 0.0.0.0:3001;
  }

  server {
      gzip on;

      listen 443 ssl;
      server_name minichat.live;

      ssl_certificate /etc/nginx/ssl/minichat.crt;
      ssl_certificate_key /etc/nginx/ssl/private.key;

      location / {
          proxy_pass http://nodes;
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection "upgrade";
      }
  }

  server {
      listen 80;

      server_name minichat.live;
      return 301 https://minichat.live$request_uri;
  }

```
