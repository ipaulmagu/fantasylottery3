const lotteries = [
  {
    id: "US",
    name: "United States",
    type: "country",
    states: [
      {
        id: "CA",
        name: "California",
        type: "state",
        games: [
          {
            name: "Daily 3",
            url: "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=daily-3&Order=No",
            min: 0,
            max: 9,
            num_cnt: 3,
            mega: 0,
            img: "https://static.www.calottery.com/~/media/Play/draw_games/Daily-3/daily-3-jackpot.png",
            nameServer: "Daily3-CA-US"
          },
          {
            name: "Daily 4",
            url: "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=daily-4&Order=No",
            min: 0,
            max: 9,
            num_cnt: 4,
            mega: 0,
            img: "https://static.www.calottery.com/~/media/Play/draw_games/Daily-4/daily-4-jackpot.png"
          },
          {
            name: "Fantasy 5",
            url:
              "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=fantasy-5&Order=No",
            min: 1,
            max: 39,
            num_cnt: 5,
            mega: 0,
            img: "https://static.www.calottery.com/~/media/Play/draw_games/Fantasy-5/fantasy-5-jackpot.png"
          },
          {
            name: "SuperLotto Plus",
            url:
              "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=superlotto-plus&Order=No",
            min: 1,
            max: 47,
            min_mega: 1,
            max_mega: 27,
            num_cnt: 5,
            mega: 1,
            img: "https://static.www.calottery.com/~/media/Play/draw_games/SuperLotto-Plus/superlottoplus-jackpot.png"
          },
          {
            name: "Mega Millions",
            url:
              "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=mega-millions&Order=No",
            min: 1,
            max: 70,
            min_mega: 1,
            max_mega: 25,
            num_cnt: 5,
            mega: 1,
            img:
              "https://static.www.calottery.com/~/media/Play/draw_games/Mega-Millions/megamillions_landing_page_logo.png"
          },
          {
            name: "PowerBall",
            url:
              "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=powerball&Order=No",
            min: 1,
            max: 69,
            min_mega: 1,
            max_mega: 26,
            num_cnt: 5,
            mega: 1,
            img: "https://static.www.calottery.com/~/media/Play/draw_games/Powerball/powerball_logo_landing_page.png"
          }
          // {
          //     name: "Daily Derby",
          //     id: "US-CA-DailyDerby",
          //     url: "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=daily-derby&Order=No",
          //     min: 0,
          //     max: 12,
          //     num_cnt: 3,
          //     mega: 0,
          // },
        ]
      },
      {
        id: "TX",
        name: "Texas",
        type: "state",
        games: []
      }
    ]
  }
];

const DefGames = {
  lotteries,
  lotteriesByGid: new Map(),
  game: lotteries[0].states[0].games[0]
};

function handleNewGameData(data) {
  console.log("[defGamesClient]. Attaching historical DATA to game '" + this.id);
  if (!this.id) {
    console.error("[defGamesClient] ERROR attaching data. no game id found. ");
    return false;
  }
  if (!data || !data.data || data.data.length < 1) {
    console.error("No data retrieved for " + this.id);
    return false;
  }
  console.log("[defGamesClient.js]. Saving game ...'" + this.id);
  if (Array.isArray(data.data)) this.data = data.data;
  // data.map(aline => aline.split(",").map(f => +f));
  else this.data = data.data.split("\n").map(aline => aline.split(",").map(f => +f));
  localStorage.setItem(this.id, JSON.stringify(this.data));
  return true;
}
// function handleLocalStorageData(gameid) {
//   let game = DefGames.lotteriesByGid ? DefGames.lotteriesByGid(gameid) : null;
//   let data = JSON.parse(localStorage.getItem(gameid));
//   if (game) game.data = data;
//   return data;
// }
function handleLocalStorageDataOnGame() {
  // this.data = JSON.parse(localStorage.getItem(this.id));
  // if (this.data && this.data.data) this.data = this.data.data;
  // return this.data;
  return (this.data = this.getLocalData(this.id));
}
function getLocalStorageDataOnGame(gameid) {
  let data = JSON.parse(localStorage.getItem(gameid));
  if (data && data.data) data = data.data;
  return data;
}
function prepareLotteries(gamesByID) {
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
          og.attachData = handleNewGameData.bind(og);
          og.getData = handleLocalStorageDataOnGame.bind(og); //handleLocalStorageData;
          og.getLocalData = getLocalStorageDataOnGame.bind(og);
          if (gamesByID) gamesByID.set(og.id, og);
        });
      });
    });
  }
}

prepareLotteries(DefGames.lotteriesByGid);

export default DefGames;
