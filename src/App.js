import React, { Component } from "react";
import "./App.css";
import Lottery from "./Lottery/Lottery";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import { GAME_NEW } from "./store/actions";

class App extends Component {
  constructor(props, context) {
    super(props);
    // console.error("[App.constructor], game_, props, context, store", game, props, context, this.store);
    // this.state = { game: this.props.game, onChange: this.onChange.bind(this) };
    this.state = { name: "App" };
    // if (this.store)
    //   this.store.subscribe(() => {
    //     console.log("[app.constructor().subscribe].state", this.store.getState());
    //   });

    // console.log("[App.constructor()].state", this.state);
    this.doDown = this.doDown.bind(this);
  }
  // componentWillUnmount() {}
  // onChange(oGame) {
  //   // () => {
  //   this.setState({ game: oGame });
  //   console.error("App.onChange().oGame, .state.game", oGame, this.state.game);
  //   // }
  // }
  // log = console.log;
  componentDidMount() {
    // const log = console.log;
    // let sURL = "https://www.calottery.com/sitecore/content/Miscellaneous/download-numbers/?GameName=daily-3&Order=No";
    // sURL = "https://jsonplaceholder.typicode.com/users";
    // this.doDown(sURL);
  }
  doDown = async sURL => {
    let errors = [];
    console.log(`Downld ... ${sURL}`);
    let txt = null;
    try {
      const resp = await axios.get(sURL);
      console.log("Fetched");
      let sContType = (resp.headers["content-type"] || "").toLowerCase();
      let isJson = sContType.indexOf("/json") >= 0 || sContType.indexOf("json/") > 0 || sContType.indexOf("json") > 0;
      try {
        // console.log("parsing...", resp, JSON.stringify(resp));
        txt = isJson ? resp.data : resp.data;
        console.log("parsing...", txt.substr(0, 500));
      } catch (err2) {
        errors.push(err2);
        console.error(`['App.doDown] Error Parsing:'${err2}'`);
      }
    } catch (err1) {
      errors.push(err1);
      console.error(`[App.doDown] Error Fetching:'${err1}'`);
    }
    // return;
    // console.log(`Errors(${errors.length}): `, errors);
    // if (txt) console.log(txt.substr(0, 500));
    // let iStartPos = -1,
    //   iCntFields = -1;
    // let lines = [];
    // txt.split("\n").forEach((aline, idx) => {
    //   if (iStartPos < 0) {
    //     let i = aline.indexOf("-------- ");
    //     if (i >= 0) {
    //       iStartPos = i + 11;
    //       iCntFields = aline.trim().split(/\s+/g).length;
    //     }
    //     return;
    //   }
    //   aline = aline.trim();
    //   if (aline.length < 1) return; //skip empty lines
    //   var fields = aline.split(/\s{2,}/g).filter((v, i) => i > 0); //[date, n, n, n, ...]
    //   fields = fields.map((n, i) => Number.parseInt(i == 0 ? +Date.parse(n) : n));
    //   lines.push(fields);
    // });
    // console.log("Saving to: ... " + " (" + lines.length + " lines)");
  };

  render() {
    // console.error("App.render().state", this.state);
    return (
      <BrowserRouter>
        {/* <AppState.Provider value={this.state}> */}
        <div className="App">
          <Lottery />
        </div>
        {/* </AppState.Provider> */}
      </BrowserRouter>
    );
  }
}

// const mapState2Props = state => {
//   return { game: state.game };
// };
// const mapDispatch2Props = disp => {
//   return { onNew: g => disp({ type: GAME_NEW, value: g }) };
// };
// export default connect(
//   mapState2Props,
//   null
// )(App);
export default App;
