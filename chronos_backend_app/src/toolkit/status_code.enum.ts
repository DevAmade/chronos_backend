export enum StatusCode {
    // Success Response
    SUCCESS = 200,
    CREATED = 201,
    NO_CONTENT = 204,

    // Client Error 4xx
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,

    // Server Error 5xx
    INTERNAL_SERVER_ERROR = 500,
}