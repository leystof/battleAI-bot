import * as dotenv from 'dotenv'

dotenv.config()

export interface Config {
    bot: {
        apiKey: string
    }
    database: {
        url: string
    }
    redis: {
        host: string
        port: number
    }
}

export let config: Config = {
    bot: {
        apiKey: process.env.TELEGRAM_API_KEY || ''
    },
    database: {
        url: process.env.DATABASE_URL || ''
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
}