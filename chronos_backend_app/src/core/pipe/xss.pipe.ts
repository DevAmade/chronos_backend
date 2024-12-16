import { Injectable, PipeTransform } from "@nestjs/common";
import * as xss from 'xss';

@Injectable()
export class XSSPipe implements PipeTransform {
    transform(value: any) {
        if(typeof value === 'string') {
            value = xss.escapeHtml(value);
        } else if(Array.isArray(value)) {
            value = value.map((val: any) => this.transform(val));
        } else if(typeof value === 'object') {
            value = Object.keys(value).reduce((previousValue, currentValue) => {
                previousValue[currentValue] = this.transform(value[currentValue]);
                return previousValue;
            }, {});
        }

        return value;
    }
}