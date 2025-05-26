"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.composer = void 0;
const grammy_1 = require("grammy");
const analyzeScene_1 = require("../../handlers/analyze/analyzeScene");
exports.composer = new grammy_1.Composer();
exports.composer.use(analyzeScene_1.composer);
