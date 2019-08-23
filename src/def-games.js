const lotteries = require("./defGamesdb");

function prepareLotteries() {
  // create filenames
  let g = lotteries[0].states[0].games[0];
  if (!g.fname || g.fname.length < 1) {
    lotteries.forEach(oCounty => {
      oCounty.states.forEach(oState => {
        oState.games.forEach(og => {
          // if (og.fname && og.fname.length > 0) return;
          let name = og.name.replace(/\s/g, "") + "-" + oState.id + "-" + oCounty.id;
          og.fname = name + ".csv";
          og.id = name;
          og.localStorageId = name;
        });
      });
    });
  }
}

prepareLotteries();

const DefGames = {
  lotteries
};
module.exports = DefGames;
