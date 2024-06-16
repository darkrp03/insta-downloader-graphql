import { Container } from "inversify";
import { InstagramService } from "../instagram/services/instagram.service";
import { StageService } from "../telegram/services/stage.service";
import { UserService } from "../telegram/services/user.service";
import { TelegramMessageService } from "../telegram/services/message.service";
import { TelegramCallbackQueryService } from "../telegram/services/callbackQuery.service";
import { TelegramCommandService } from "../telegram/services/command.service";

export function loadContainers() {
    container.bind<InstagramService>(InstagramService).toSelf().inSingletonScope();
    container.bind<StageService>(StageService).toSelf().inSingletonScope();
    container.bind<UserService>(UserService).toSelf().inSingletonScope();
    container.bind<TelegramCommandService>(TelegramCommandService).toSelf().inSingletonScope();
    container.bind<TelegramMessageService>(TelegramMessageService).toSelf().inSingletonScope();
    container.bind<TelegramCallbackQueryService>(TelegramCallbackQueryService).toSelf().inSingletonScope();
}

export const container = new Container();