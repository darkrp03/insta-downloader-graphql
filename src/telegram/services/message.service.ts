import { messages } from "../models/message";
import { Context } from "telegraf";
import { InstagramService } from "../../instagram/services/instagram.service";

export class TelegramMessageService {
    private readonly instagramService: InstagramService;

    constructor() {
        this.instagramService = new InstagramService();
    }

    async processMessage(ctx: Context): Promise<void> {
        if (!ctx.message || !ctx.text) {
            return;
        }

        try {
            await ctx.reply(messages.loading);
            const media = await this.instagramService.getMedia(ctx.text);

            if (!media || media.length === 0) {
                await ctx.reply(messages.fail);

                return;
            }

            await ctx.sendMediaGroup(media);
        }
        catch (err) {
            await ctx.reply(messages.fail);
            throw err;
        }
    }
}