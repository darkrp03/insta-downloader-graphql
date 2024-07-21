import { Scenes, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { TelegramCommandService } from "../services/command.service";
import { TelegramMessageService } from "../services/message.service";
import { container } from "../../configs/container";

export class TelegramBotHandlers {
    private readonly commandService: TelegramCommandService;
    private readonly messageService: TelegramMessageService;

    constructor(private readonly bot: Telegraf<Scenes.WizardContext>) {
        this.commandService = container.resolve(TelegramCommandService);
        this.messageService = container.resolve(TelegramMessageService);
    }

    private initStartHandler() {
        this.bot.start(this.commandService.start.bind(this.commandService));
    }

    private initHelpHandler() {
        this.bot.help(this.commandService.help.bind(this.commandService));
    }

    private initKeyboardHandler() {
        this.bot.on(message('text'), this.messageService.processMessage.bind(this.messageService));
    }

    initHandlers() {
        this.initStartHandler();
        this.initHelpHandler();
        this.initKeyboardHandler();
    }
}