import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashPasswordPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        if(value.password) {

           /*
           * Salt generation with bcrypt.
           */
            const salt = await bcrypt.genSalt();

            /* 
            * Password hash with bcrypt including salt.
            */
            value.password = await bcrypt.hash(value.password, salt);

        }

        /*
        * Return the hashed password.
        */
        return value;
    }
}