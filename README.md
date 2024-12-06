# Insta Downloader
**Insta Downloader** - telegram bot that can download a media from instagram. You only need to send a link to the media, and bot will return the downloaded content.<br> 

<div align="center">
  <img src="https://github.com/user-attachments/assets/642c0e72-11a7-4c66-a67f-7d8e2fcb63a0">
</div>

# Features
1.<b>Auto deploy</b>. You can configure github repository with secrets and deploy it to your server using the deploy.yml file. <br>
2.<b>Simple start</b>. You can start project using docker compose and env file. Program will get the tokens and start the services by itself. <br>
3.<b>Security</b>. The program has 1 level security for /webhook endpoint: <b>api key</b>. If we have an invalid api key, access is denied.<br>

# Environment variables
The following environment variables are required for correct program operation: <br>

```env
TELEGRAM_TOKEN 
API_KEY
NGROK_AUTH_TOKEN
```

<b>TELEGRAM_TOKEN</b> - telegram bot token. <br>
<b>NGROK_AUTH_TOKEN</b> - ngrok auth token. <br>
<b>API_KEY</b> - your custom token to protect the /webhook endpoint from another users.  <br>

# Installation
1.Clone this project. <br>
2.Open cmd and navigate to the project folder. <br>
3.Run <b>docker-compose.yml. </b>
```bash
docker compose up
```

Docker will install the node.js environment and ngrok package.
