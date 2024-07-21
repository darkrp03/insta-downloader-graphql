import dotenv from "dotenv";
import ngrok from "@ngrok/ngrok";
import Fastify from 'fastify'
import { TelegramBot } from "./telegram/bot.js";
import { loadContainers } from "./configs/container.js";

const env = process.env.NODE_ENV || 'development';
dotenv.config({path: `.env.${env}`});

loadContainers();

const bot = new TelegramBot();

const fastify = Fastify({
    logger: true
});

fastify.post('/webhook', async function handler (request, reply) {
    try {
        if (request.body) {
            await bot.update(request.body);
        }
    } catch (err) {
        console.log(err);
    } finally {
        return reply.status(200).send();
    }
});

const port = Number(process.env.PORT);

if (Number.isNaN(port)) {
    throw new Error('Incorrect port value!');
}

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
    console.log(url);
});
