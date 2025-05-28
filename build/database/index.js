"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchRepository = exports.userRepository = exports.dataSourceDatabase = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../database/models/user");
const config_1 = require("../utils/config");
const match_1 = require("../database/models/match");
const options = config_1.config.database;
exports.dataSourceDatabase = new typeorm_1.DataSource({
    ...options,
    cache: { type: 'redis' },
    entities: [user_1.User, match_1.Match],
});
exports.userRepository = exports.dataSourceDatabase.getRepository(user_1.User);
exports.matchRepository = exports.dataSourceDatabase.getRepository(match_1.Match);
