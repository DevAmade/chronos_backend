import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsNotDuplicatedArrayValueConstraint implements ValidatorConstraintInterface {

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const set = new Set();

        for(const val of value) {
            if(set.has(val.playerId)) {
                return false;
            }

            set.add(val.playerId);
        }

        return true;
    }

    defaultMessage(args: ValidationArguments): string {
        return `One of the elements in ${args.property} is already selected`;
    }
}

export function IsNotDuplicatedArrayValue(validationOptions?: ValidationOptions): 
    (object: Object, propertyName: string) => void {
        return function (object: Object, propertyName: string): void {
            registerDecorator({
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                constraints: [],
                async: true,
                validator: IsNotDuplicatedArrayValueConstraint,
            });
        };
    }