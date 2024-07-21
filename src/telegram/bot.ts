import { Scenes, Telegraf } from "telegraf";
import { TelegramBotHandlers } from "./handlers/handlers";

export class TelegramBot {
    private readonly bot: Telegraf<Scenes.WizardContext>;

    constructor() {
        const token = process.env.TELEGRAM_TOKEN;

        if (!token) {
            throw new Error('Empty telegram bot token!');
        }

        this.bot = new Telegraf(token);
        this.initialize();
    }

    async update(body: any) {
        await this.bot.handleUpdate(body);
    }

    async setWebhook(url: string): Promise<void> {
        await this.bot.telegram.setWebhook(`${url}/webhook`);
    }

    private initialize() {
        const handlers = new TelegramBotHandlers(this.bot);
        handlers.initHandlers();
    }
}