import { enLocale } from "../../locales/en";
import { Context } from "telegraf";

export class TelegramCommandService {
    async start(ctx: Context): Promise<void> {
        if (!ctx.message) {
            return;
        }

        const botName = ctx.botInfo.first_name;
        const startMessage = enLocale.messages.start.replace('{0}', ctx.message.from.first_name).replace('{1}', botName);

        await ctx.reply(startMessage, { parse_mode: 'HTML' });
    }

    async help(ctx: Context): Promise<void> {
        if (!ctx.message) {
            return;
        }

        await ctx.reply(enLocale.messages.help, { parse_mode: 'HTML' });
    }
}