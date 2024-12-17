import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

import { APP } from '../../../main';

@ValidatorConstraint({ async: true })
export class IsResourceIdConstraint implements ValidatorConstraintInterface {

    async validate(value: any, args: ValidationArguments) {
        const service = (await APP).get(args.constraints[0]);

        return await service.findOneById(value) ? true : false;
    }

    defaultMessage(args: ValidationArguments) {
        return `This resource with the ${args.property} ${args.value} doesn't exists`;
    }
}

export function IsResourceId(service: any, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [service],
            async: true,
            validator: IsResourceIdConstraint,
        });
    };
}