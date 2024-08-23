import "reflect-metadata";
import axios from "axios";
import locale from "../../locales/en.json";
import { Context } from "telegraf";
import { injectable } from "inversify";
import { InstagramService } from "../../instagram/services/instagram.service";
import { RegexService } from "../../instagram/services/regex.service";

@injectable()
export class TelegramMessageService {
    async processMessage(ctx: Context) {
        try {
            if (!ctx.message || !ctx.text) {
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

            const response = await axios.get(media, {
                responseType: 'arraybuffer'
            })

            await ctx.sendVideo({ source: response.data });
        }
        catch (err) {
            await ctx.reply(locale.messages.fail);
            console.log(err);
            throw err;
        }
    }
}