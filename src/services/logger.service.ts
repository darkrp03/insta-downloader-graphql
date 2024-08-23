import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
    return stack
        ? `${timestamp} ${level}: ${message}\nStack Trace\n${stack}`
        : `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
    format: combine(
        timestamp({ format: 'DD.MM.YYYY HH:mm:ss' }),
        colorize(),
        customFormat
    ),
    transports: [
        new transports.Console()
    ]
});