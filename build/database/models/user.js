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
exports.User = exports.UserStatus = void 0;
const typeorm_1 = require("typeorm");
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["BAN"] = "ban";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
let User = class User {
    id;
    tgId;
    admin;
    status;
    balance;
    usernameVisibility;
    points;
    winRate;
    loseRate;
    created_at;
    updated_at;
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tgId', type: 'bigint', unique: true }),
    __metadata("design:type", Number)
], User.prototype, "tgId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin', type: 'bool', width: 1, default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "admin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance', type: "int", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'username_visibility', type: "boolean", default: 1 }),
    __metadata("design:type", Boolean)
], User.prototype, "usernameVisibility", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'points', type: "int", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'win_rate', type: "int", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "winRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lose_rate', type: "int", default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "loseRate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
