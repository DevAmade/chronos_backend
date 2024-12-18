import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

import { APP } from '../../../main';
import { CreateGameSessionDto } from '../../game_session/dto/create_game_session.dto';
import { GameService } from '../../game/service/game.service';
import { Game } from '../../game/model/game.model';

@ValidatorConstraint({ async: true })
export class IsCorrectNumberOfPlayerConstraint implements ValidatorConstraintInterface {
    private game: Game;

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const gameService = (await APP).get(GameService);
        this.game = await gameService.findOneById((args.object as CreateGameSessionDto).gameId);

        return value.length > this.game.maxNumberPlayers ||
            value.length < this.game.minNumberPlayers ? false : true;
    }

    defaultMessage(args: ValidationArguments): string {
        return `The number of players must be between ${this.game.minNumberPlayers} and ${this.game.maxNumberPlayers}`;
    }
}

export function IsCorrectNumberOfPlayer(validationOptions?: ValidationOptions):
    (object: Object, propertyName: string) => void {
        return function (object: Object, propertyName: string) {
            registerDecorator({
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                constraints: [],
                async: true,
                validator: IsCorrectNumberOfPlayerConstraint,
            });
        };
    }