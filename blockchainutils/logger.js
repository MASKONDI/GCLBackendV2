const { transports, createLogger, format } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new transports.File({
            filename:'../logs/fabriClient.log',
            level:'info'
        }),
        new transports.File({
            filename: '../logs/fabriClient_error.log',
            level: 'error'
        })
    ]
});

module.exports = logger
