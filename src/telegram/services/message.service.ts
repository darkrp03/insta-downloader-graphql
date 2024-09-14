import { enLocale } from "../../locales/en";
import { Context } from "telegraf";
import { InstagramService } from "../../instagram/services/instagram.service";

export class TelegramMessageService {
    async processMessage(ctx: Context): Promise<void> {
        try {
            if (!ctx.message || !ctx.text) {
                return;
            }

            const instagramService = new InstagramService();
            
            await ctx.reply(enLocale.messages.loading);
            const media = await instagramService.getMedia(ctx.text);

            if (!media) {
                await ctx.reply(enLocale.messages.fail);

                return;
            }

            await ctx.sendMediaGroup(media);
        }
        catch (err) {
            await ctx.reply(enLocale.messages.fail);
            throw err;
        }
    }
}