import dotenv from "dotenv";
import ngrok from "@ngrok/ngrok";
import Fastify from 'fastify'
import { TelegramBot } from "./telegram/bot.js";
import { loadContainers } from "./configs/container.js";
import { logger } from "./services/logger.service.js";

const env = process.env.NODE_ENV || 'development';
dotenv.config({path: `.env.${env}`});

loadContainers();

const bot = new TelegramBot();
const fastify = Fastify();

fastify.post('/webhook', async function handler (request, reply) {
    logger.log('info', `Process the incoming request ${request.id}...`,);

    try {
        if (request.body) {
            await bot.update(request.body);
        }

        logger.log('info', `Request ${request.id} processed successfully!`);
    } catch (err) {
        logger.log('error', err);
    } finally {
        return reply.status(200).send();
    }
});

const port = Number(process.env.PORT);

fastify.listen({ port: port }, async (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

    const listener = await ngrok.connect({addr: port, authtoken_from_env: true});
    const url = listener.url();

    if (!url) {
        throw new Error('Empty ngrok url!');
    }

    await bot.setWebhook(url);

    logger.log('info', 'Bot successfully started!');
});
