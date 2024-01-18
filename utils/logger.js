import  { createLogger, transports ,format} from "winston";


const Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.json(),
    format.timestamp()
),
  transports: [
    // - Write all logs error (and below) to `somefile.log`.
    new transports.File({ filename: 'logs/somefile.log', level: 'error' })
  ]
}); 
export default Logger;