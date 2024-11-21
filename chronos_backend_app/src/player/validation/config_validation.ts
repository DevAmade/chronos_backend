/*
* Player pseudo configuration
*/
export const PLAYER_PSEUDO_MIN_LENGTH = 3;
export const PLAYER_PSEUDO_MAX_LENGTH = 15;
export const PLAYER_PSEUDO_REGEX = '^[a-zA-Z0-9 ]*$';

/*
* Player last name configuration
*/
export const PLAYER_LAST_NAME_MIN_LENGTH = 2;
export const PLAYER_LAST_NAME_MAX_LENGTH = Infinity;
export const PLAYER_LAST_NAME_REGEX = '^[a-zA-Z]+$';

/*
* Player first name configuration
*/
export const PLAYER_FIRST_NAME_MIN_LENGTH = 2;
export const PLAYER_FIRST_NAME_MAX_LENGTH = Infinity;
export const PLAYER_FIRST_NAME_REGEX = '^[a-zA-Z]+$';

/*
* Player password configuration
*/
export const PLAYER_PASSWORD_MIN_LENGTH = 12;
export const PLAYER_PASSWORD_MIN_UPPERCASE = 1;
export const PLAYER_PASSWORD_MIN_LOWERCASE = 1;
export const PLAYER_PASSWORD_MIN_NUMBERS = 1;
export const PLAYER_PASSWORD_MIN_SYMBOLS = 1;