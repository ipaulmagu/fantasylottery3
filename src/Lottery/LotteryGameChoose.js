import React, { Component } from "react";
import Spinner from "../UI/Spinner";
import DefGames from "../defGamesClient";
import M from "materialize-css";

class LotteryGameChoose extends Component {
  constructor(props) {
    super(props);
    // this.props = props;
    this.dlgName = props.dlgName;
    this.games = DefGames.lotteries; //props.games;
    this.gamesByGid = DefGames.lotteriesByGid; //props.gamesByGid;
    // this.onGameChanged = props.onGameChanged;

    let [gname, gstate, gcountry] = (props.game ? props.game.id : "?game?-?S?-?c?").split("-");
    this.state = {
      game: props.game,
      gname,
      gstate,
      gcountry,
      gimg: props.game ? props.game.img : null,
      isLoading: false // props.game !== null
    };
    this.refBtnUpdateData = React.createRef();
    this.onGameChanged = this.onGameChanged.bind(this);
    this.cbGameChangedSuccess = this.cbGameChangedSuccess.bind(this);
    this.cbGameChangedError = this.cbGameChangedError.bind(this);
    this.onChangeGameSelectionGame = this.onChangeGameSelectionGame.bind(this);
    this.onChangeGameSelectionState = this.onChangeGameSelectionState.bind(this);
    this.onChangeGameSelectionCountry = this.onChangeGameSelectionCountry.bind(this);
    this.showGamesForStateNCountry = this.showGamesForStateNCountry.bind(this);
    this.dbGetData = this.dbGetData.bind(this);
    // console.log("LotteryGameChoose.Constructor(), .state, props", this.state, props);
  }
  componentDidMount() {
    // console.log("[LotteryGameChoose.componentDidMount()].props.game", this.props.game);
  }

  cbGameChangedSuccess = oGame => {
    // console.log("[LotteryGameChoose.cbGameChangedSuccess]");
    // document.getElementById("idBtnUpdateData").classList.add("disabled");
    this.refBtnUpdateData.current.classList.remove("disabled");
    this.refBtnUpdateData.current.classList.add("disabled");
    this.setState({ isLoading: false });
    if (this.props.cbGameChanged) this.props.cbGameChanged(oGame);
  };

  cbGameChangedError = (err, oGame) => {
    // console.error("[LotteryGameChoose.cbGameChangedError] ", err);
    this.setState({ isLoading: false });
    if (oGame) {
      oGame.getData();
      if (oGame.data && oGame.data.length > 0)
        M.toast({
          html: `'${oGame.id}' uses <strong>OLD</strong> Data!`,
          classes: "rounded orange black-text lighten-3"
        });
      let [gname, gstate, gcountry] = oGame.id.split("-");
      this.setState({ gname, gstate, gcountry, game: oGame, gimg: oGame.img, isLoading: false });
      if (this.props.cbGameChanged) this.props.cbGameChanged(oGame);
    }
  };

  dbGetData = async oGame => {
    const CONSTs = {
      cHour: 60 * 60 * 1000,
      cDay: 24 * this.cHour
    };
    let txt = null;
    let host = "https://lottery-us1.firebaseio.com/games-date";
    let hostData = "https://lottery-us1.firebaseio.com/games-data";
    let need2RefreshData = false;
    let dtNow = +new Date();
    try {
      let oData = await fetch(`${host}/${oGame.id}.json`);
      if (oData) oData = await oData.json();
      need2RefreshData = !oData || !oData.dtUpdated || (oData.dtUpdated && dtNow - oData.dtUpdated > CONSTs.cHour);
      // if (!oData) need2RefreshData = true;
      // else {
      //   need2RefreshData = oData.dtUpdated && (dtNow - oData.dtUpdated > CONSTs.cHour);
      // }
      if (!need2RefreshData) {
        need2RefreshData = true; //assume a failure; data could not be retrieved and will be restored
        oData = await fetch(`${hostData}/${oGame.id}.json`);
        if (oData) {
          oData = await oData.json();
          if (oData)
            return {
              status: 0,
              body: "[dbGetData]",
              msg: "success",
              params: { gameid: oGame.id },
              data: Array.isArray(oData) ? oData : oData.split("\n").map(aline => aline.split(","))
            };
        }
      }
    } catch (err) {
      console.error(`[dbGetData.getDates]:'${err.toString()}'`);
      need2RefreshData = true;
      // return {
      //   status: 0,
      //   body: "[dbGetData.getDates].Error",
      //   msg: "Failed:" + err.toString(),
      //   params: { gameid: oGame.id },
      //   data: null
      // };
    }

    if (need2RefreshData) {
      let sURL = oGame.url;
      try {
        console.log(`... Fetching lottery numbers`);
        let oData = await fetch(sURL);
        console.log(`... toText()`);
        if (oData) txt = await oData.text();
        console.log(`... Parsing lottery numbers`);

        let iStartPos = -1,
          iCntFields = -1;
        let submitNewData = false;
        let dataLocal = oGame.getLocalData(oGame.id);
        let localDataExists = dataLocal && dataLocal[0] && dataLocal[0][0],
          isVerified = !localDataExists; //verified if local data does NOT exist; submitdata =false;

        let lines = [];
        txt.split("\n").forEach((aline, idx) => {
          if (iStartPos < 0) {
            let i = aline.indexOf("-------- ");
            if (i >= 0) {
              iStartPos = i + 11;
              iCntFields = aline.trim().split(/\s+/g).length;
            }
            return;
          }
          aline = aline.trim();
          if (aline.length < 1) return; //skip empty lines
          var fields = aline.split(/\s{2,}/g).filter((v, i) => i > 0); //[date, n, n, n, ...]
          fields = fields.map((n, i) => Number.parseInt(i === 0 ? +Date.parse(n) : n));
          if (!isVerified) {
            submitNewData = fields[0] > 0 && dataLocal[0][0] - fields[0] !== 0; //1st lotto drawing has different dates
            isVerified = true;
          }
          lines.push(fields);
        });

        if (submitNewData) {
          console.log(`...Saving NEWER Game Dates`);
          oData = await fetch(`${host}/${oGame.id}.json`, {
            method: "PATCH", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json"
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify({ dtUpdated: dtNow }) // body data type must match "Content-Type" header
          });
          if (oData && oData.json) oData = await oData.json();

          console.log(`...PUT-Dates DONE!!! Result:${JSON.stringify(oData)}`);
          console.log(`...Saving NEWER Game Data('${lines.length}' lines)`);
          // txt = lines.map(aline => aline.join(",")).join("\n");
          oData = await fetch(`${hostData}/${oGame.id}.json`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json"
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(lines) // body data type must match "Content-Type" header
          });
          if (oData && oData.json) oData = await oData.json();
          console.log(`...Saving Game Data DONE!!!`);
        }
        // File.savecsv(oGame.fname, lines);
        // File.savecsv("./" + path.basename(f2), lines);
        // log(`[GameMgr.downloadLottoData('${gameid}')] exiting ...`);
        console.log(`...exiting`);
        return { status: 0, body: "[dbGetData]", msg: "success", params: { gameid: oGame.id }, data: lines };
        // if (cb) cb({ status: 0, msg: "success", params: { gameid }, data: lines });
        // log(`Fetched ${sURL}`);
      } catch (err) {
        console.error(`[dbGetData.getGameNums]:'${err.toString()}'`);
        txt = undefined;
        return {
          status: 0,
          body: "[dbGetData.getGameNums].Error",
          msg: "Failed: " + err.toString(),
          params: { gameid: oGame.id },
          data: null
        };
      }
    }
  };

  onGameChanged = async (oGame, cbDone, cbError) => {
    //new game requested; get Data
    //New GAME Selected
    if (!oGame) return;
    // this.setState({ img: oGame.img });
    // console.log(`[LotteryGameChoose.gameChanged()] fetching data for ${oGame.id}...`);
    let res = await this.dbGetData(oGame);
    if (res && res.data) {
      if (oGame.attachData({ data: res.data })) {
        // console.log("[LotteryGameChoose.dataAttached()]", oGame);
        if (cbDone) cbDone(oGame);
        M.toast({ html: `'<strong>${oGame.id}</strong>' loaded!`, classes: "rounded green lighten-3 black-text" });
      }
    } else {
      if (!res) res = { body: null, msg: null, params: null };
      M.toast({
        html: `<span style="height:'auto'">Error Loading (<strong>${oGame.id}</strong>)<br> "${
          res.msg
        }"<hr><Strong>Internet Connection</Strong> issues!</span>`,
        classes: "rounded red lighten-3 black-text",
        displayLength: 14000
      });
      if (cbError) cbError("Error Loading Data", oGame);
    }
    // let host = "http://localhost:1000";

    // fetch(`${host}/lotto/game/${oGame.id}`)
    //   .then(data => {
    //     const contentType = data.headers.get("content-type");
    //     let isJson = contentType && ["/json", "json\\"].filter(s => contentType.indexOf(s) !== -1).length > 0;
    //     return isJson ? data.json() : data.text();
    //   })
    //   .then(data => {
    //     if (oGame.attachData(data)) {
    //       // console.log("[LotteryGameChoose.dataAttached()]", oGame);
    //       if (cbDone) cbDone(oGame);
    //     }
    //   })
    //   .catch(err => {
    //     console.log("[LotteryGameChoose.fetch] Error:", err);
    //     if (cbError) cbError(err, oGame);
    //   });
  };
  onChangeGameSelectionGame = async ev => {
    //SELECT changed; new game requested
    // console.log("idGames.onChange ev:", ev);
    let el = ev.currentTarget || ev.target;
    let gid = el.value;
    if (!this.state) {
      // console.log("[LotteryGameChoose.idGames.onChange] this.state not found! [gameid, this]=",gid,this);
      return;
    }
    let g = this.gamesByGid.get(gid);
    if (!g) {
      console.error("[LotteryGameChoose.idGames.onChange] GAME NOT found! game", g);
      return;
    }
    if (g && this.state.game !== g) {
      this.setState({ gname: g.id, game: g, gimg: g.img, isLoading: true });
      if (this.onGameChanged) await this.onGameChanged(g, this.cbGameChangedSuccess, this.cbGameChangedError);
    } else {
      //reject selection
      // el.selectedIndex = -1;
      console.log("[LotteryGameChoose.idGames.onChange] Game change REJECTED (game == state.game)");
    }
  };

  onChangeGameSelectionState = ev => {
    ev.preventDefault();
    //console.log("idState.onChange ev:", ev);
    this.setState({ gstate: (ev.currentTarget || ev.target).value, gname: null, gimg: null });
    document.getElementById("idGames").selectedIndex = -1;
  };
  onChangeGameSelectionCountry = ev => {
    ev.preventDefault();
    // console.log("[LotteryGameChoose.js] idCountry.onChange:", this.state);
    document.getElementById("idState").selectedIndex = -1;
    document.getElementById("idGames").selectedIndex = -1;
    return this.setState({ gcountry: ev.target.value, gstate: null, gname: null, gimg: null });
  };
  showGamesForStateNCountry = () => {
    if (!this.state.gstate) {
      // console.log("Pop Games, State.gstate does not exist! State=", this.state);
      return;
    }
    let c_ = this.games.filter(c => c.id && c.id.toLowerCase() === this.state.gcountry.toLowerCase())[0];
    if (c_ && c_.states) {
      let gs_ = c_.states.filter(st => st.id.toLowerCase() === this.state.gstate.toLowerCase())[0];
      // console.log("pop Games; Game:", gs_);
      if (!gs_) {
        // console.log("pop Games; Game not found");
        return;
      }
      return gs_.games.map(g => (
        <option key={g.id} value={g.id}>
          {g.name}
        </option>
      ));
    }
    // console.log(c_);
  };

  render() {
    // console.log("[LotteryGameChoose.render()].state", this.state);
    const styles = {
      title: { background: "rgba(238, 221, 170, 0.875)", marginBottom: "0", paddingBottom: "0.2em" },
      selCont: {
        background: "#aee6",
        display: "flex",
        flexFlow: "row",
        padding: "0.3em 1em",
        justifyContent: "flex-start",
        overflow: "hidden"
      },
      gameLogoNav: {
        background: `
        linear-gradient(90deg, #fffa 0, #fffd 0),
          url("${this.state.gimg}") no-repeat center
            `,
        backgroundSize: "contain"
      }
    };

    return (
      <div>
        <div id={this.dlgName} className="modal">
          <div className="modal-content" style={{ padding: "0px" }}>
            <h4 style={styles.title}>Select a Game</h4>
            <div id="idNavLotto" style={styles.selCont}>
              <select id="idCountry" onChange={this.onChangeGameSelectionCountry} value={this.state.gcountry}>
                {this.games.map(c => (
                  <option key={c.id} value={c["id"]}>
                    {c["name"]}
                  </option>
                ))}
              </select>
              <select id="idState" onChange={this.onChangeGameSelectionState} value={this.state.gstate}>
                {(() => {
                  // console.log("Pop States: country=", this.state.gcountry, this.state);
                  let c_ = this.games.filter(c => c.id && c.id === this.state.gcountry)[0];
                  return c_ && c_.states
                    ? c_.states.map(st => (
                        <option key={st.id} value={st.id}>
                          {st.name}
                        </option>
                      ))
                    : null;
                })()}
              </select>

              <select
                id="idGames"
                className="uigames"
                value={this.state.game.id}
                onChange={this.onChangeGameSelectionGame}
                // style={styles.gameLogoNav}
              >
                {this.showGamesForStateNCountry()}
              </select>
              {!this.state.isLoading ? (
                <img className="LogoLotto" src={this.state.gimg} alt="Lotto Loggo" />
              ) : (
                <Spinner />
              )}
            </div>
          </div>
          <div className="modal-footer" style={{ background: "#eeddaa9c" }}>
            <a
              href="#!"
              ref={this.refBtnUpdateData}
              id="idBtnUpdateData"
              className={
                "btn waves-effect waves-green btn-flat" +
                (this.state.game ? (!localStorage.hasOwnProperty(this.state.game.id) ? " pulse" : "") : " disabled")
              }
              onClick={async ev => {
                // console.log("A#idBtnUpdateData.Click");
                if (this.state.game) {
                  this.setState({ isLoading: true });
                  await this.onGameChanged(this.state.game, this.cbGameChangedSuccess, this.cbGameChangedError);
                }
              }}
              style={
                !this.state.game
                  ? {}
                  : !localStorage.hasOwnProperty(this.state.game.id)
                  ? { color: "green" }
                  : { color: "gray" }
              }
            >
              <span>
                <i
                  className="material-icons inOut"
                  style={{
                    fontSize: "1.5em",
                    marginRight: "10px",
                    verticalAlign: "middle",
                    animationDuration:
                      this.state.game && !localStorage.hasOwnProperty(this.state.game.id) ? "0.5s" : "initial"
                  }}
                >
                  cloud_download
                </i>
                {this.state.game
                  ? (!localStorage.hasOwnProperty(this.state.game.id) ? "Download" : "Update") + " Data"
                  : ""}
              </span>
            </a>
            <a href="#!" className="modal-close waves-effect waves-green btn-flat">
              Close
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default LotteryGameChoose;
