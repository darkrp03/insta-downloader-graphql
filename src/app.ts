import { TelegramBot } from "./telegram/bot.js";
import { loadAwsCredentials } from "./configs/aws.js";
import dotenv from "dotenv";
import Fastify from 'fastify'
import { loadContainers } from "./configs/container.js";

const env = process.env.NODE_ENV || 'development';
dotenv.config({path: `.env.${env}`});

loadAwsCredentials();
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

const port = Number(process.env.PORT as string);

fastify.listen({ port: port }, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}) 