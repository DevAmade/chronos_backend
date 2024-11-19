import { Admin } from "./admin/model/admin.model";
import { Avatar } from "./avatar/model/avatar.model";
import { Game } from "./game/model/game.model";
import { GameSession } from "./game_session/model/game_session.model";
import { GameSessionPlayer } from "./game_session/model/game_session_player.model";
import { FavoritePlayer } from "./player/model/favorite_player.model";
import { GameOwned } from "./player/model/game_owned.model";
import { Player } from "./player/model/player.model";

export const DATABASE_MODELS = [
    Player,
    FavoritePlayer,
    GameOwned,
    Admin,
    Game,
    GameSession,
    GameSessionPlayer,
    Avatar,
]