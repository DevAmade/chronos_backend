import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsNotDuplicatedJoinConstraint implements ValidatorConstraintInterface {

    async validate(value: any, args: ValidationArguments) {
        const service = args.constraints[0];
        const secondResourceId = Object.values(args.object)[1];

        return await service.findOneByAttribute(value, secondResourceId) ? false : true;
    }

    defaultMessage(args: ValidationArguments) {
        const secondResource = Object.keys(args.object)[1];
        const secondResourceId = Object.values(args.object)[1];

        return `This join between the ${args.property} ${args.value} and the ${secondResource} ${secondResourceId} already exists`;
    }
}

export function IsNotDuplicatedJoin(service: any, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [service],
            async: true,
            validator: IsNotDuplicatedJoinConstraint,
        });
    };
}