import "reflect-metadata";
import { UserService } from "./user.service";
import { i18n } from "../../configs/languages";
import { CustomWizardContext } from "../interfaces/context";
import { getMainKeyboard, getMediaKeyboard, getSettingsKeyboard, languageKeyboard } from "../../configs/keyboard";
import { inject, injectable } from "inversify";

@injectable()
export class TelegramMessageService {
    private readonly userService: UserService;

    constructor(@inject(UserService) userService: UserService) {
        this.userService = userService;
    }

    private getKeyFromJSON(json: { [key: string]: any }, filterValue: string): string | undefined {
        const keys = Object.keys(json);

        for (const key of keys) {
            const value = json[key];

            if (typeof value === 'object') {
                const key = this.getKeyFromJSON(value, filterValue);

                if (key) {
                    return key;
                }
            }

            if (json[key] === filterValue) {
                return key;
            }
        }
    }

    async processMessage(ctx: CustomWizardContext) {
        try {
            if (!ctx.message) {
                return;
            }

            if (!ctx.text) {
                return;
            }

            const user = await this.userService.getUser(ctx.message.chat.id);

            if (!user) {
                return;
            }

            i18n.setLocale(user.lang);

            const locale = i18n.getCatalog(user.lang);
            const key = this.getKeyFromJSON(locale, ctx.text);

            if (!key) {
                return;
            }

            switch (key) {
                case "media":
                    const mediaTypeMessage = i18n.__('messages.chooseMediaMessage');
                    await ctx.reply(mediaTypeMessage, { reply_markup: getMediaKeyboard() });

                    break;
                case "downloadReel":
                    ctx.scene.enter("reel-input-scene");

                    break;
                case "downloadPost":
                    ctx.scene.enter("post-input-scene");
                    
                    break;
                case "helpCenter":
                    const helpCenterMessage = i18n.__('messages.helpMessage');
                    await ctx.reply(helpCenterMessage, { parse_mode: 'HTML' });

                    break;
                case "settings":
                    const chooseActionMessage = i18n.__('messages.chooseActionMessage');
                    await ctx.reply(chooseActionMessage, { reply_markup: getSettingsKeyboard() });

                    break;
                case "language":
                    const chooseLanguageMessage = i18n.__('messages.chooseLanguageMessage');
                    await ctx.reply(chooseLanguageMessage, { reply_markup: languageKeyboard });

                    break;
                case "backButton":
                    const mainMenuMessage = i18n.__('messages.mainMenuMessage');
                    await ctx.reply(mainMenuMessage, { reply_markup: getMainKeyboard() });

                    break;
            }
        }
        catch (err) {
            const failMessage = i18n.__('messages.failMessage');

            console.log(err);
            await ctx.reply(failMessage);
        }
    }
}