"use strict";
const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");
const logDir = "MonitorLog";
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}
const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-results.log`,
    datePattern: "YYYY-MM-DD",
    format: format.json()
});
const logger = createLogger({
    level: "info",
    format: format.combine(
    format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.printf(async info => {
        `${info.timestamp} ${info.level}: ${info.message}`;
        //saving logs in database
      })
    ),
    transports: [
      dailyRotateFileTransport
    ]
});
//logging  info
const chokidar = require('chokidar');
chokidar.watch('installed', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
    path = (path.split(" ")[0]);
    let pathVal = path.includes("MonitorLog");
    if(pathVal == true){
        if(event !="change"){
            logger.info({
                event:event,
                path:path
            });
        }
        
    }else{
        logger.info({
            event:event,
            path:path
        });
    }
    
});