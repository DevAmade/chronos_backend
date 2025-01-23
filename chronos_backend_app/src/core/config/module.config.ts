/*
* Set to 'console.log' if you want database logs to be displayed in the console.
*/
export const LOGGING_DATABASE = false;

/*
* Set to true if you want server logs be displayed in the console.
*/
export const LOGGING_SERVER = true;

/*
* Set request limit for rate limiting.
*/
export const RATE_LIMITING_REQUEST_LIMIT_SHORT = 3;
export const RATE_LIMITING_REQUEST_LIMIT_MEDIUM = 20;
export const RATE_LIMITING_REQUEST_LIMIT_LONG = 100;

/*
* Set time limit for rate limiting (milliseconds).
*/
export const RATE_LIMITING_TIME_LIMIT_SHORT = 1000;
export const RATE_LIMITING_TIME_LIMIT_MEDIUM = 10000;
export const RATE_LIMITING_TIME_LIMIT_LONG = 60000;

/*
* Set to true if you want log files to be created.
*/
export const WRITE_LOG_FILE = true;

/*
* Set log files name.
*/
export const LOG_FILE_NAME = 'application.log';

/*
* Set log files path.
*/
export const LOG_FILE_PATH = './log';

/*
* Set log files max size (bytes).
*/
export const LOG_FILE_MAX_SIZE = 500000;

/*
* Set to true if you want log files to be archived in a zip file.
*/
export const ARCHIVED_LOG_FILE = true;