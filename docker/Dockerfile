FROM node:latest

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    nano

#Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

#Install pm2 globally
RUN npm i pm2 -g