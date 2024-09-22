process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

import config from "config";
import Fastify from "fastify";
import { TelegramBot } from "./telegram/bot.js";
import { logger } from "./shared/services/logger.service.js";

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

fastify.listen({ host: config.get('host'), port: 3000 }, async (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }

    logger.log('info', 'Bot successfully started!');
});