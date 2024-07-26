import "reflect-metadata";
import locale from "../../locales/en.json";
import { Context } from "telegraf";
import { injectable } from "inversify";

@injectable()
export class TelegramCommandService {
    private readonly userId: number;

    constructor() {
        this.userId = Number(process.env.USER_ID);
    }

    async start(ctx: Context) {
        if (!ctx.message) {
            return;
        }

        if (!Number.isNaN(this.userId) && this.userId !== ctx.message.from.id) {
            return;
        }

        const botName = ctx.botInfo.first_name;
        const startMessage = locale.messages.start.replace('{0}', ctx.message.from.first_name).replace('{1}', botName);

        await ctx.reply(startMessage, { parse_mode: 'HTML' });
    }

    async help(ctx: Context) {
        if (!ctx.message) {
            return;
        }

        if (!Number.isNaN(this.userId) && this.userId !== ctx.message.from.id) {
            return;
        }

        await ctx.reply(locale.messages.help, { parse_mode: 'HTML' });
    }
}