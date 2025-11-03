import pino from "pino";

const isTest = process.env.NODE_ENV === "test";

const logger = pino({
    level: isTest ? "error" : "info", 
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            translateTime: "SYS:standard"
        },
    },
});

export default logger;
