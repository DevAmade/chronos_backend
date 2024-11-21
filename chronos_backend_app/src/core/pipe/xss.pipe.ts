import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as xss from 'xss';

@Injectable()
export class XSSPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        value = Object.keys(value).reduce((previousValue, currentValue) => {
            
            if(typeof value[currentValue] === 'string') {
                previousValue[currentValue] = xss.escapeHtml(value[currentValue]);
            } else {
                previousValue[currentValue] = value[currentValue];
            }

            return previousValue;
        }, {});

        return value;
    }
}