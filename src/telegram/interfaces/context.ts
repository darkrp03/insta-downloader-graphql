import { Context, Scenes } from "telegraf";

export interface CustomWizardContext extends Context {
    scene: Scenes.SceneContextScene<CustomWizardContext>;
}