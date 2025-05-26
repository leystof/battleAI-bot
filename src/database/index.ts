import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from '@/database/models/user'
import { config } from '@/utils/config'

const options = config.database as DataSourceOptions

export const dataSourceDatabase = new DataSource({
    ...options,
    cache: {type: 'redis'},
    entities: [User],
})

export const userRepository = dataSourceDatabase.getRepository(User)
