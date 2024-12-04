import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import { TelegramBot } from "./telegram/bot.js";
import { logger } from "./shared/services/logger.service.js";

dotenv.config();

const apiKey: string | undefined = process.env.API_KEY;

if (!apiKey) {
    throw new Error('Missing api key!');
}

const bot = new TelegramBot();
const app = express();

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
    logger.log('info', 'Process the incoming request');

    const host = req.headers.host;

    if (!host?.includes('ngrok')) {
        res.sendStatus(200);

        return;
    }

    const userApiKey = req.query.apiKey?.toString();

    if (userApiKey !== apiKey) {
        res.sendStatus(200);

        return;
    }

    try {
        if (req.body) {
            await bot.update(req.body);
        }

        logger.log('info', 'Request processed successfully!');
    } catch (err) {
        logger.log('error', err);
    } finally {
        res.sendStatus(200);
    }
});

app.listen(3000, () => {
    logger.log('info', 'Bot successfully started!');
});