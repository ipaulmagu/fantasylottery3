import Settings from "./settings";
import DefGames from "../defGamesClient";
import * as ACTIONS from "./actions";

let gameSaved = Settings.getLastGame();
// if (gameSaved) gameSaved = DefGames.lotteriesByGid.get(gameSaved.id)
const game = gameSaved || DefGames.game;
if (!gameSaved && game) {
  Settings.setLastGame(game);
}
// if (!game) game = DefGames.game;
const initState = {
  game,
  onNewGame: g => {},
  maxDrawings: 10,
  strategies: []
};

// console.log("[gameModifier]Game:", initState.game);

const gameModifier = (state = initState, action) => {
  // console.log("[gameModifier] .state:", state, "*** action:", action);
  switch (action.type) {
    case ACTIONS.GAME_NEW:
      console.log("[gameModifier.GAME_NEW].action.game:", action.game);
      if (action.game) Settings.setLastGame(action.game);
      return { ...state, game: action.game };

    case ACTIONS.MAX_DRAWINGS_SET:
      console.log("[gameModifier.MAX_DRAWINGS_SET].action:", action);
      return { ...state, maxDrawings: action.v };
    case ACTIONS.STRATEGY_ADD:
      // console.log("[gameModifier.STRATEGY_ADD].action:", action);
      let o1 = { ...state, strategies: [...state.strategies] };
      o1.strategies.push(action.v);
      console.log(`[gameModifier.STRATEGY_ADD '${action.v}'].o1`, o1);
      return o1;
    case ACTIONS.STRATEGY_DEL:
      // console.log("[gameModifier.STRATEGY_DEL].action:", action);
      let o2 = { ...state };
      let i2 = o2.strategies.indexOf(action.v);
      if (i2 >= 0) {
        o2.strategies.splice(i2, 1);
      }
      console.log(`[gameModifier.STRATEGY_DEL '${action.v}'].o2`, o2);
      return o2;

    default:
      break;
  }
  return state;
};

export default gameModifier;
