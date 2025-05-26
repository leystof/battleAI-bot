"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.dataSourceDatabase = void 0;
const typeorm_1 = require("typeorm");
const user_1 = require("../database/models/user");
const config_1 = require("../utils/config");
const options = config_1.config.database;
exports.dataSourceDatabase = new typeorm_1.DataSource({
    ...options,
    cache: { type: 'redis' },
    entities: [user_1.User],
});
exports.userRepository = exports.dataSourceDatabase.getRepository(user_1.User);
