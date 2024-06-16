import "reflect-metadata"
import { Scenes } from "telegraf";
import { i18n } from "../../configs/languages";
import { MediaGroup } from "telegraf/typings/telegram-types";
import { InstagramService } from "../../instagram/services/instagram.service";
import { inject, injectable } from "inversify";

@injectable()
export class StageService {
    private readonly instagramService: InstagramService

    constructor(@inject(InstagramService) instagramService: InstagramService) {
        this.instagramService = instagramService;
    }

    async processMedia(id: string, ctx: Scenes.WizardContext<Scenes.WizardSessionData>) {
        if (!ctx.message) {
            return;
        }

        const loadingMessage = i18n.__('messages.loadingMessage');
        await ctx.reply(loadingMessage);

        const instagramService = new InstagramService();
        const media = await instagramService.getMedia(id);

        if (!media) {
            return await ctx.reply("Incorrect url!");
        }

        await ctx.sendMediaGroup(media as MediaGroup, {
            reply_parameters: {
                message_id: ctx.message.message_id
            }
        });
    }

    private getReelScene() {
        const reelInputScene = new Scenes.WizardScene<Scenes.WizardContext>(
            'reel-input-scene',
            async (ctx) => {
                const reelsMessage = i18n.__('messages.reelTipMessage');
                await ctx.reply(reelsMessage, { parse_mode: 'HTML' })

                return ctx.wizard.next();
            },
            async (ctx) => {
                try {
                    const userText = ctx.text;

                    if (!userText) {
                        return ctx.scene.leave();
                    }

                    const mediaInfo = await this.instagramService.getReelsInfoFromUrl(userText);

                    if (!mediaInfo) {
                        const reelNotFoundMessage = i18n.__('messages.notFoundMessages.reel');

                        await ctx.reply(reelNotFoundMessage);
                        return ctx.scene.leave();
                    }

                    await this.processMedia(mediaInfo, ctx);
                }
                catch (err) {
                    console.log(err);

                    const failMessage = i18n.__('messages.failMessage');
                    await ctx.reply(failMessage);
                }
                finally {
                    return ctx.scene.leave();
                }
            }
        );

        return reelInputScene;
    }

    private getPostScene() {
        const postInputScene = new Scenes.WizardScene<Scenes.WizardContext>(
            'post-input-scene',
            async (ctx) => {
                const reelsMessage = i18n.__('messages.postTipMessage');
                await ctx.reply(reelsMessage, { parse_mode: 'HTML' })

                return ctx.wizard.next();
            },
            async (ctx) => {
                try {
                    const userText = ctx.text;

                    if (!userText) {
                        return ctx.scene.leave();
                    }

                    const mediaInfo = await this.instagramService.getPostInfoFromUrl(userText);

                    if (!mediaInfo) {
                        const postNotFoundMessage = i18n.__('messages.notFoundMessages.post');

                        await ctx.reply(postNotFoundMessage);
                        return ctx.scene.leave();
                    }

                    await this.processMedia(mediaInfo, ctx);
                }
                catch (err) {
                    console.log(err);

                    const failMessage = i18n.__('messages.failMessage');
                    await ctx.reply(failMessage);
                }
                finally {
                    return ctx.scene.leave();
                }
            }
        );

        return postInputScene;
    }

    getStageInstance() {
        return new Scenes.Stage<Scenes.WizardContext>([this.getReelScene(), this.getPostScene()]);
    }
}