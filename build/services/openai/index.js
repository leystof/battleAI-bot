"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI = void 0;
const ai_1 = require("ai");
const openai_1 = require("@ai-sdk/openai");
exports.AI = {
    client: openai_1.openai,
    aiGenerateText: ai_1.generateText,
};
