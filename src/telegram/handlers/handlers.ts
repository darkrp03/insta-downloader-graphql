import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { TelegramCommandService } from "../services/command.service";
import { TelegramMessageService } from "../services/message.service";

export class TelegramBotHandlers {
    private readonly commandService: TelegramCommandService;
    private readonly messageService: TelegramMessageService;

    constructor(private readonly bot: Telegraf) {
        this.commandService = new TelegramCommandService();
        this.messageService = new TelegramMessageService();
    }

    private initStartHandler(): void {
        this.bot.start(this.commandService.start.bind(this.commandService));
    }

    private initHelpHandler(): void {
        this.bot.help(this.commandService.help.bind(this.commandService));
    }

    private initKeyboardHandler(): void {
        this.bot.on(message('text'), this.messageService.processMessage.bind(this.messageService));
    }

    initHandlers() {
        this.initStartHandler();
        this.initHelpHandler();
        this.initKeyboardHandler();
    }
}