/*
* Set to true if you want database logs to be displayed in the console.
*/
export const LOGGING_DATABASE = false;

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