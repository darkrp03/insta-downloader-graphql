import "reflect-metadata";
import { Context } from "telegraf";
import { getMainKeyboard, languageKeyboard } from "../../configs/keyboard";
import { UserService } from "./user.service";
import { i18n } from "../../configs/languages";
import { inject, injectable } from "inversify";

@injectable()
export class TelegramCommandService {
    private readonly userService: UserService;

    constructor(@inject(UserService) userService: UserService) {
        this.userService = userService;
    }

    async start(ctx: Context) {
        if (!ctx.message) {
            return;
        }

        const user = await this.userService.getUser(ctx.message.chat.id);

        if (user) {
            i18n.setLocale(user.lang);
            
            const message = i18n.__('messages.startMessage');
            const botName = (await ctx.telegram.getMe()).first_name;

            const startMessage = message.replace('{0}', ctx.message.from.first_name).replace('{1}', botName);

            await ctx.reply(startMessage, { parse_mode: 'HTML', reply_markup: getMainKeyboard() });

            return;
        }

        await ctx.reply("Choose language", { parse_mode: 'HTML', reply_markup: languageKeyboard });
    }

    async help(ctx: Context) {
        if (!ctx.message) {
            return;
        }

        const user = await this.userService.getUser(ctx.message!.chat.id);

        if (user) {
            i18n.setLocale(user.lang);

            const message = i18n.__('messages.helpMessage');
            const botName = (await ctx.telegram.getMe()).first_name;
            const helpMessage = message.replace('{0}', ctx.message.from.first_name).replace('{1}', botName);

            await ctx.reply(helpMessage, { parse_mode: 'HTML' });

            return;
        }

        await ctx.reply("Choose language", { parse_mode: 'HTML', reply_markup: languageKeyboard });
    }
}