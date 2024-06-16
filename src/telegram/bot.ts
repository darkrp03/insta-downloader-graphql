import { Scenes, Telegraf, session } from "telegraf";
import { TelegramBotHandlers } from "./handlers/handlers";
import { StageService } from "./services/stage.service";
import { container } from "../configs/container";

export class TelegramBot {
    private readonly bot: Telegraf<Scenes.WizardContext>;
    private readonly stageService: StageService;

    constructor() {
        const token = process.env.TELEGRAM_TOKEN;

        if (!token) {
            throw new Error('Empty telegram bot token!');
        }

        this.stageService = container.resolve(StageService);

        this.bot = new Telegraf<Scenes.WizardContext>(token);
        this.bot.use(session());
        this.bot.use(this.stageService.getStageInstance().middleware());

        this.initialize();
    }

    private initialize() {
        const handlers = new TelegramBotHandlers(this.bot);
        handlers.initHandlers();
    }

    async update(body: any) {
        await this.bot.handleUpdate(body);
    }
}