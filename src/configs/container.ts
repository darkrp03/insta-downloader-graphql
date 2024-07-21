import { Container } from "inversify";
import { InstagramService } from "../instagram/services/instagram.service";
import { TelegramMessageService } from "../telegram/services/message.service";
import { TelegramCommandService } from "../telegram/services/command.service";

export function loadContainers() {
    container.bind<InstagramService>(InstagramService).toSelf().inSingletonScope();
    container.bind<TelegramCommandService>(TelegramCommandService).toSelf().inSingletonScope();
    container.bind<TelegramMessageService>(TelegramMessageService).toSelf().inSingletonScope();
}

export const container = new Container();