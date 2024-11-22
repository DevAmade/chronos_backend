import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import * as xss from 'xss';

@Injectable()
export class XSSPipe implements PipeTransform {
    transform(value: any) {
        if(typeof value === 'object') {
            value = Object.keys(value).reduce((previousValue, currentValue) => {
                
                if(typeof value[currentValue] === 'string') {
                    previousValue[currentValue] = xss.escapeHtml(value[currentValue]);
                } else {
                    previousValue[currentValue] = value[currentValue];
                }
    
                return previousValue;
            }, {});
        } else if (typeof value === 'string') {
            value = xss.escapeHtml(value);
        }

        return value;
    }
}