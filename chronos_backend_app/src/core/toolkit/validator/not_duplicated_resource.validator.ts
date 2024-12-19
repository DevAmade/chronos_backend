import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsNotDuplicatedResourceConstraint implements ValidatorConstraintInterface {

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const service = args.constraints[0];

        return await service.findOneByAttribute([{ [args.property]: value }]) ? false : true;
    }

    defaultMessage(args: ValidationArguments): string {
        return `This resource with the ${args.property} ${args.value} already exists`;
    }
}

export function IsNotDuplicatedResource(service: any, validationOptions?: ValidationOptions): 
    (object: Object, propertyName: string) => void {
        return function (object: Object, propertyName: string) {
            registerDecorator({
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                constraints: [service],
                async: true,
                validator: IsNotDuplicatedResourceConstraint,
            });
        };
    }