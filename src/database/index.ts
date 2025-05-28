import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from '@/database/models/user'
import { config } from '@/utils/config'
import {Match} from "@/database/models/match";

const options = config.database as DataSourceOptions

export const dataSourceDatabase = new DataSource({
    ...options,
    cache: {type: 'redis'},
    entities: [User, Match],
})

export const userRepository = dataSourceDatabase.getRepository(User)
export const matchRepository = dataSourceDatabase.getRepository(Match)
