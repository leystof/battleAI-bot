"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupHandlers = void 0;
const grammy_1 = require("grammy");
const other_1 = require("./other");
const profile_1 = require("./profile");
const game_1 = require("./game");
const errorBoundary_1 = require("./other/errorBoundary");
const scenes_1 = require("../handlers/scenes");
function setupHandlers(bot) {
    try {
        const composer = new grammy_1.Composer();
        composer.use();
        composer.use(errorBoundary_1.composer);
        composer.use(scenes_1.allScenes.manager());
        composer.use(other_1.composer);
        composer.use(profile_1.composer);
        composer.use(game_1.composer);
        composer.use(scenes_1.allScenes);
        bot.use(composer);
    }
    catch (e) {
        console.log(e);
    }
}
exports.setupHandlers = setupHandlers;
