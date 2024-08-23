import "reflect-metadata";
import locale from "../../locales/en.json";
import { Context } from "telegraf";
import { injectable } from "inversify";

@injectable()
export class TelegramCommandService {
    async start(ctx: Context) {
        if (!ctx.message) {
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

        await ctx.reply(locale.messages.help, { parse_mode: 'HTML' });
    }
}