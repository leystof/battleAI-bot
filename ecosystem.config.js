module.exports = {
    apps: [
        {
            name: "battleai-bot",
            script: "build/index.js",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "2G",

            restart_delay: 10000,
            max_restarts: 1000,
            env: {
                NODE_ENV: "production",
            }
        }
    ]
};
