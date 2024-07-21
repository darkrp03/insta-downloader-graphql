import "reflect-metadata";
import locale from "../../locales/en.json";
import { Context } from "telegraf";
import { injectable } from "inversify";
import { InstagramService } from "../../instagram/services/instagram.service";
import { MediaGroup } from "telegraf/typings/telegram-types";
import { RegexService } from "../../instagram/services/regex.service";
import { MediaItem } from "../../instagram/interfaces/instagram";

@injectable()
export class TelegramMessageService {
    async processMessage(ctx: Context) {
        try {
            if (!ctx.message || !ctx.text) {
                return;
            }

            await ctx.reply(locale.messages.loading);

            const instagramService = new InstagramService();
            let id = RegexService.getReelsInfoFromUrl(ctx.text);

            if (!id) {
                id = RegexService.getPostInfoFromUrl(ctx.text);

                if (!id) {
                    return await ctx.reply(locale.messages.notFound);
                }
            }

            const media = await instagramService.getMedia(id);

            if (!media) {
                return await ctx.reply(locale.messages.fail);
            }

            await this.sendMediaMessage(ctx, media);
        }
        catch (err) {
            console.log(locale.messages.fail);
            throw err;
        }
    }

    private async sendMediaMessage(ctx: Context, media: MediaItem | MediaItem[]): Promise<void> {
        if (!ctx.message) {
            return;
        }

        if (Array.isArray(media)) {
            await ctx.sendMediaGroup(media as MediaGroup, {
                reply_parameters: {
                    message_id: ctx.message.message_id
                }
            });

            return;
        }

        if (media.type === 'video') {
            await ctx.sendVideo(media.media, { supports_streaming: true });
        }

        if (media.type === 'photo') {
            await ctx.sendPhoto(media.media);
        }
    }
}