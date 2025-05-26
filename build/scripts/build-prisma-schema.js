"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const schemaBase = path_1.default.join(__dirname, '../../prisma/schema.prisma');
const modelsDir = path_1.default.join(__dirname, '../../prisma/models');
const outPath = path_1.default.join(__dirname, '../../prisma/schema.generated.prisma');
const main = () => {
    const base = fs_1.default.readFileSync(schemaBase, 'utf-8');
    const models = fs_1.default
        .readdirSync(modelsDir)
        .filter(f => f.endsWith('.prisma'))
        .map(f => fs_1.default.readFileSync(path_1.default.join(modelsDir, f), 'utf-8'))
        .join('\n\n');
    const full = `${base}\n\n${models}`;
    fs_1.default.writeFileSync(outPath, full);
    console.log('✅ schema.generated.prisma created');
};
main();
