import * as dotenv from 'dotenv'

dotenv.config()

export interface Config {
    bot: {
        apiKey: string
    }
    openai: {
        apiKey: string
    }
    falai: {
        apiKey: string
    }
    database: {
        type: string
        host: string
        port: number
        username: string
        password: string
        database: string
        logging: boolean
        [key: string]: any
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
    openai: {
        apiKey: process.env.OPENAI_API_KEY || ''
    },
    falai: {
        apiKey: process.env.FALAI_API_KEY || ''
    },
    database: {
        type: process.env.DB_TYPE || 'mysql',
        host: process.env.DB_HOST || 'mariadb',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || '',
        logging: process.env.DB_LOGGING === 'true',
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
    },
}