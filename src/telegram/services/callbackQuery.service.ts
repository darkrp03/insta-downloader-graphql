import "reflect-metadata";
import { Context } from "telegraf";
import { i18n } from "../../configs/languages";
import { UserService } from "./user.service";
import { User } from "../models/user";
import { getMainKeyboard } from "../../configs/keyboard";
import { inject, injectable } from "inversify";

@injectable()
export class TelegramCallbackQueryService {
    private readonly userService: UserService;

    constructor(@inject(UserService) userService: UserService) {
        this.userService = userService;
    }

    private async processLanguageCallback(ctx: Context, data: string) {
        const params = data.split(' ');
        const lang = params[1];

        i18n.setLocale(lang);
        const message =  i18n.__('messages.startMessage');

        const callback = ctx.callbackQuery;

        if (!callback?.message) {
            return;
        }

        await ctx.telegram.deleteMessage(callback.message.chat.id, callback.message.message_id);

        const botName = (await ctx.telegram.getMe()).first_name;
        const startMessage = message.replace('{0}', callback.from.first_name).replace('{1}', botName);

        await ctx.telegram.sendMessage(callback.message.chat.id, startMessage, { parse_mode: 'HTML', reply_markup: getMainKeyboard() });

        const user: User = {
            id: callback.message.chat.id,
            lang: lang
        };

        const foundUser = await this.userService.getUser(user.id);

        if (foundUser) {
            return await this.userService.updateUser(user);
        }

        await this.userService.addUser(user);
    }

    async processCallbackQuery(ctx: Context, data: string) {
        if (data.includes('lang')) {
            return await this.processLanguageCallback(ctx, data);
        }
    }
}