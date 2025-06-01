import { DataSource, DataSourceOptions } from 'typeorm'
import { User } from '@/database/models/user'
import { config } from '@/utils/config'
import {Match} from "@/database/models/match";
import {Transaction} from "@/database/models/transaction";
import {PaymentProvider} from "@/database/models/paymentProvider";
import {Config} from "@/database/models/config";
import {TierProvider} from "@/database/models/TierProvider";

const options = config.database as DataSourceOptions

export const dataSourceDatabase = new DataSource({
    ...options,
    // cache: {
    //     type: 'redis',
    //     options: {
    //         host: config.redis.host,
    //         port: config.redis.port,
    //     }
    // },
    // @ts-ignore
    ssl: true,
    extra: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
    entities: [User, Match,Transaction, PaymentProvider, TierProvider,Config]
})

export const userRepository = dataSourceDatabase.getRepository(User)
export const matchRepository = dataSourceDatabase.getRepository(Match)
export const transactionRepository = dataSourceDatabase.getRepository(Transaction)
export const configRepository = dataSourceDatabase.getRepository(Config)
export const paymentProviderRepository = dataSourceDatabase.getRepository(PaymentProvider)
export const tierProviderRepository = dataSourceDatabase.getRepository(TierProvider)
