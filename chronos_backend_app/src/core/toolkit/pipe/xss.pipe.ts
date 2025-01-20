import { Injectable, PipeTransform } from "@nestjs/common";
import * as xss from 'xss';

@Injectable()
export class XSSPipe implements PipeTransform {
    transform(value: any) {
        if(typeof value === 'string') {

            /*
            * If the value is a string, the HTML characters are escaped.
            */
            value = xss.escapeHtml(value);

        } else if(Array.isArray(value)) {

            /*
            * If the value is an array, the method is recalled for all the values in the array
            * and recreates a new array with the values whose HTML characters are escaped.
            */
            value = value.map((val: any) => this.transform(val));

        } else if(typeof value === 'object') {

            /* 
            * If the value is an object, the method is recalled for all the values in the object
            * and recreates a new object with the values whose HTML characters are escaped.
            */
            value = Object.keys(value).reduce((previousValue, currentValue) => {
                previousValue[currentValue] = this.transform(value[currentValue]);
                return previousValue;
            }, {});

        }

        /* 
        * Return the safe value.
        */
        return value;
    }
}