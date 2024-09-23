import dotenv from "dotenv";
import Fastify from "fastify";
import { TelegramBot } from "./telegram/bot.js";
import { logger } from "./shared/services/logger.service.js";

dotenv.config();

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

const host = process.env.NODE_ENV === 'dev' ? '0.0.0.0' : 'localhost';

fastify.listen({ host: host, port: 3000 }, async (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

    logger.log('info', 'Bot successfully started!');
});