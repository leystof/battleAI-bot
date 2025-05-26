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
exports.User = exports.GameStatus = exports.GameType = void 0;
const typeorm_1 = require("typeorm");
var GameType;
(function (GameType) {
    GameType["PROMPT"] = "prompt";
})(GameType = exports.GameType || (exports.GameType = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["QUEUE"] = "queue";
    GameStatus["ERROR"] = "error";
    GameStatus["FINISH"] = "finish";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
let User = class User {
    id;
    status;
    type;
    bet;
    created_at;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: GameStatus,
        default: GameStatus.QUEUE
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: GameType,
        default: GameType.PROMPT
    }),
    __metadata("design:type", String)
], User.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bet', type: "int", nullable: false }),
    __metadata("design:type", Number)
], User.prototype, "bet", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
