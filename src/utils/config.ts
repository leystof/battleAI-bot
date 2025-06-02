import * as dotenv from 'dotenv'

dotenv.config()

export interface Config {
    domain: {
        url: string
    }
    bot: {
        mainApiKey: string
        alertApiKey: string
    }
    openai: {
        apiKey: string
    }
    falai: {
        apiKey: string
    }
    armoney: {
        apiKey: string
        secretKey: string
        shopId: string
        payUrl: string
    }
    bybit: {
        apiKey: string
    }
    cryptomus: {
        apiKey: string,
        shopId: string
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
    domain: {
        url: process.env.DOMAIN_URL || ''
    },
    bot: {
        mainApiKey: process.env.TELEGRAM_MAIN_API_KEY || '',
        alertApiKey: process.env.TELEGRAM_ALERT_API_KEY || ''
    },
    openai: {
        apiKey: process.env.OPENAI_API_KEY || ''
    },
    falai: {
        apiKey: process.env.FALAI_API_KEY || ''
    },
    bybit: {
        apiKey: process.env.BYBIT_API_KEY || ''
    },
    armoney: {
        apiKey: process.env.ARMONEY_API_KEY || '',
        secretKey: process.env.ARMONEY_SECRET_KEY || '',
        shopId: process.env.ARMONEY_SHOP_ID || '',
        payUrl: process.env.ARMONEY_PAY_URL || ''
    },
    cryptomus: {
        apiKey: process.env.CRYPTOMUS_API_KEY || '',
        shopId: process.env.CRYPTOMUS_SHOP_ID || '',
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