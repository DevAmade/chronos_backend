import { HttpException, HttpStatus } from "@nestjs/common";

export class UniqueException extends HttpException {
    constructor() {
        super('This resource already exists', HttpStatus.CONFLICT);
    }
}