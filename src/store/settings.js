import DefGames from "./../defGamesClient";

export default class Settings {
  static getLastGame() {
    let sGameId = JSON.parse(localStorage.getItem("Lottery-Last-Game"));
    let oGame = sGameId && sGameId.length > 0 ? DefGames.lotteriesByGid.get(sGameId) : null;
    if (oGame && !oGame.data) oGame.getData();
    // console.log("[Settings.getLastGame()] ...", oGame);
    return oGame;
  }
  static setLastGame(game) {
    // console.log("[Settings.setLastGame()] ... ", game.id);
    localStorage.setItem("Lottery-Last-Game", JSON.stringify(game.id.trim()));
  }
  static getLastUser() {
    let o = JSON.parse(localStorage.getItem("Lottery-Last-User"));
    // console.log("[Settings.getLastUser()] ...", o);
    return o;
  }
  static setLastUser(user) {
    // console.log("[Settings.setLastUser()] ... ", user);
    localStorage.setItem("Lottery-Last-User", JSON.stringify(user));
  }
}
