FROM node:22

RUN apt-get update && \
    apt-get install -y wget unzip && \
    wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.zip && \
    unzip ngrok-v3-stable-linux-amd64.zip && \
    mv ngrok /usr/local/bin/ && \
    rm ngrok-v3-stable-linux-amd64.zip