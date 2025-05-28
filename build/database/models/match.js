"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Match = exports.MatchStatus = exports.MatchType = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../../database/models/user");
var MatchType;
(function (MatchType) {
    MatchType["PROMPT"] = "prompt";
})(MatchType = exports.MatchType || (exports.MatchType = {}));
var MatchStatus;
(function (MatchStatus) {
    MatchStatus["QUEUE"] = "queue";
    MatchStatus["WAIT_PROMPTS"] = "wait_prompts";
    MatchStatus["ANALYZE"] = "analyze";
    MatchStatus["ERROR"] = "error";
    MatchStatus["SUCCESSFUL"] = "successful";
})(MatchStatus = exports.MatchStatus || (exports.MatchStatus = {}));
let Match = class Match {
    id;
    originalPrompt;
    player1;
    player1Prompt;
    player2;
    player2Prompt;
    win;
    status;
    type;
    bet;
    img_url;
    created_at;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Match.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'original_prompt', type: "text", default: '' }),
    __metadata("design:type", String)
], Match.prototype, "originalPrompt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, { nullable: false }),
    __metadata("design:type", user_1.User)
], Match.prototype, "player1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'player1_prompt', type: "text", default: '' }),
    __metadata("design:type", String)
], Match.prototype, "player1Prompt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, { nullable: false }),
    __metadata("design:type", user_1.User)
], Match.prototype, "player2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'player2_prompt', type: "text", default: '' }),
    __metadata("design:type", String)
], Match.prototype, "player2Prompt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_1.User, { nullable: true }),
    __metadata("design:type", user_1.User)
], Match.prototype, "win", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MatchStatus,
        default: MatchStatus.QUEUE
    }),
    __metadata("design:type", String)
], Match.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MatchType,
        default: MatchType.PROMPT
    }),
    __metadata("design:type", String)
], Match.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bet', type: "int", nullable: false }),
    __metadata("design:type", Number)
], Match.prototype, "bet", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'img_url', type: "varchar", default: "" }),
    __metadata("design:type", String)
], Match.prototype, "img_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Match.prototype, "created_at", void 0);
Match = __decorate([
    (0, typeorm_1.Entity)()
], Match);
exports.Match = Match;
