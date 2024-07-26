import "reflect-metadata";
import locale from "../../locales/en.json";
import { Context } from "telegraf";
import { injectable } from "inversify";
import { InstagramService } from "../../instagram/services/instagram.service";
import { RegexService } from "../../instagram/services/regex.service";

@injectable()
export class TelegramMessageService {
    private readonly userId: number;

    constructor() {
        this.userId = Number(process.env.USER_ID);
    }

    async processMessage(ctx: Context) {
        try {
            if (!ctx.message || !ctx.text) {
                return;
            }

            if (!Number.isNaN(this.userId) && this.userId !== ctx.message.from.id) {
                return;
            }

            const instagramService = new InstagramService();
            let id = RegexService.getReelsInfoFromUrl(ctx.text);

            if (!id) {
                return await ctx.reply(locale.messages.notFound);
            }

            await ctx.reply(locale.messages.loading);
            const media = await instagramService.getReelUrl(id);

            if (!media) {
                return await ctx.reply(locale.messages.fail);
            }

            await ctx.sendVideo(media, { supports_streaming: true });
        }
        catch (err) {
            await ctx.reply(locale.messages.fail);
            throw err;
        }
    }
}