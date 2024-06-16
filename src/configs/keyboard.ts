import { InlineKeyboardMarkup, ReplyKeyboardMarkup } from "telegraf/typings/core/types/typegram";
import { i18n } from "./languages";

export const languageKeyboard: InlineKeyboardMarkup = {
    inline_keyboard: [
        [
            { text: 'English 🇬🇧', callback_data: 'lang en' },
            { text: 'Ukrainian 🇺🇦', callback_data: 'lang ua' }
        ]
    ]
}

export function getSettingsKeyboard(): ReplyKeyboardMarkup {
    const changeLanguageText = i18n.__('keyboards.settingsKeyboard.language');
    const backText = i18n.__('keyboards.backButton');

    const settingsKeyboard: ReplyKeyboardMarkup = {
        keyboard: [
            [{text: changeLanguageText}],
            [{text: backText}]
        ],
        resize_keyboard: true
    }

    return settingsKeyboard;
}

export function getMediaKeyboard(): ReplyKeyboardMarkup {
    const downloadReelText = i18n.__('keyboards.mediaKeyboard.downloadReel');
    const downloadPostText = i18n.__('keyboards.mediaKeyboard.downloadPost');
    const backText = i18n.__('keyboards.backButton');

    const mediaKeyboard: ReplyKeyboardMarkup = {
        keyboard: [
            [{ text: downloadReelText }], 
            [{ text: downloadPostText }], 
            [{ text: backText }]
        ],
        resize_keyboard: true
    }

    return mediaKeyboard;
}

export function getMainKeyboard(): ReplyKeyboardMarkup {
    const mediaText = i18n.__('keyboards.mainKeyboard.media');
    const helpCenterText = i18n.__('keyboards.mainKeyboard.helpCenter');
    const setttingsText = i18n.__('keyboards.mainKeyboard.settings');

    const mainKeyboard: ReplyKeyboardMarkup = {
        keyboard: [
            [{text: mediaText }],
            [{ text: helpCenterText }], 
            [{ text: setttingsText }]
        ],
        resize_keyboard: true
    }

    return mainKeyboard;
}