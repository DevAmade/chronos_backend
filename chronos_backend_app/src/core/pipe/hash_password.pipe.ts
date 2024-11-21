import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const salt = await bcrypt.genSalt();

        value.password = await bcrypt.hash(value.password, salt);

        return value;
    }
}