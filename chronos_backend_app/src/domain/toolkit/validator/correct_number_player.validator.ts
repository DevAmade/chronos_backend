import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';

import { APP } from '../../../main';
import { GameService } from '../../game/service/game.service';
import { Game } from '../../game/model/game.model';
import { CreateGameSessionDto } from '../../game_session/dto/create_game_session.dto';
import { GAME_SESSION_MAX_NUMBER_OF_PLAYERS,
         GAME_SESSION_MIN_NUMBER_OF_PLAYERS } from '../../game_session/validation/validation.config';

@ValidatorConstraint({ async: true })
export class IsCorrectNumberOfPlayerConstraint implements ValidatorConstraintInterface {
    private game: Game;

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const gameService = (await APP).get(GameService);
        this.game = await gameService.findOneById((args.object as CreateGameSessionDto).gameId);
        value.push({ playerId: (args.object as CreateGameSessionDto).organizerId });

        return this.game ? 
            value.length <= this.game.maxNumberPlayers &&
            value.length >= this.game.minNumberPlayers :
            value.length <= GAME_SESSION_MAX_NUMBER_OF_PLAYERS &&
            value.length >= GAME_SESSION_MIN_NUMBER_OF_PLAYERS;
    }

    defaultMessage(args: ValidationArguments): string {
        return this.game ? 
            `The number of players must be between ${this.game.minNumberPlayers} and ${this.game.maxNumberPlayers}` :
            `The number of players must be between ${GAME_SESSION_MIN_NUMBER_OF_PLAYERS} and ${GAME_SESSION_MAX_NUMBER_OF_PLAYERS}`;
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