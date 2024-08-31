import axios from "axios";
import { enLocale } from "../../locales/en";
import { Context } from "telegraf";
import { InstagramService } from "../../instagram/services/instagram.service";
import { RegexService } from "../../instagram/services/regex.service";

export class TelegramMessageService {
    async processMessage(ctx: Context): Promise<void> {
        try {
            if (!ctx.message || !ctx.text) {
                return;
            }

            const instagramService = new InstagramService();
            let id = RegexService.getReelsInfoFromUrl(ctx.text);

            if (!id) {
                await ctx.reply(enLocale.messages.notFound);

                return;
            }

            await ctx.reply(enLocale.messages.loading);
            const media = await instagramService.getReelUrl(id);

            if (!media) {
                await ctx.reply(enLocale.messages.fail);

                return;
            }

            const response = await axios.get(media, {
                responseType: 'arraybuffer'
            })

            await ctx.sendVideo({ source: response.data });
        }
        catch (err) {
            await ctx.reply(enLocale.messages.fail);
            throw err;
        }
    }
}