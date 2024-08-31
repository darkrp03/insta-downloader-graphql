import { Telegraf } from "telegraf";
import { TelegramBotHandlers } from "./handlers/handlers";

export class TelegramBot {
    private readonly bot: Telegraf;

    constructor() {
        const token = process.env.TELEGRAM_TOKEN;

        if (!token) {
            throw new Error('Empty telegram bot token!');
        }

        this.bot = new Telegraf(token);
        this.initialize();
    }

    async update(body: any): Promise<void> {
        await this.bot.handleUpdate(body);
    }

    async setWebhook(url: string): Promise<void> {
        await this.bot.telegram.setWebhook(`${url}/webhook`);
    }

    private initialize(): void {
        const handlers = new TelegramBotHandlers(this.bot);
        handlers.initHandlers();
    }
}