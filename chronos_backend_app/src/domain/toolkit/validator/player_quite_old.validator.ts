import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator } from 'class-validator';
import * as dayjs from 'dayjs';

import { CreateGameSessionDto } from '../../game_session/dto/create_game_session.dto';
import { PlayerService } from '../../player/service/player.service';
import { Player } from '../../player/model/player.model';
import { GameService } from '../../game/service/game.service';
import { Game } from '../../game/model/game.model';

@ValidatorConstraint({ async: true })
export class IsPlayersQuiteOldConstraint implements ValidatorConstraintInterface {
    private game: Game;

    async validate(value: any, args: ValidationArguments): Promise<boolean> {
        const playerService = new PlayerService(Player);
        const gameService = new GameService(Game);
        const gameSessionPlayer = value;
        this.game = await gameService.findOneById((args.object as CreateGameSessionDto).gameId);

        if(!this.game) {
            return true;
        }

        const organizerAge = this.calculatePlayerAge(await playerService.findOneById((args.object as CreateGameSessionDto).organizerId));
        
        if(this.game.pegi > organizerAge) {
            return false;
        }

        for(const player of gameSessionPlayer) {
            const age = this.calculatePlayerAge(await playerService.findOneById(player.playerId));
            
            if(this.game.pegi > age) {
                return false;
            }
        }
        
        return true;
    }

    defaultMessage(args: ValidationArguments): string {
        return `One of the players is under the required age. The minimum age is ${this.game.pegi} years`;
    }

    calculatePlayerAge(player: Player): number {
        const today = dayjs();
        const birth = dayjs(player.birthdate);

        let age = today.year() - birth.year();

        if(today.isBefore(birth.add(age, 'year'))) {
            age--;
        }

        return age;
    }
}

export function IsPlayersQuiteOld(validationOptions?: ValidationOptions):
    (object: Object, propertyName: string) => void {
        return function (object: Object, propertyName: string) {
            registerDecorator({
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                constraints: [],
                async: true,
                validator: IsPlayersQuiteOldConstraint,
            });
        };
    }