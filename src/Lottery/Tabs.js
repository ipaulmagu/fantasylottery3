import React, { Component } from "react";
import M from "materialize-css";
import Drawings from "./Drawings";
import Strategy from "./strategy/Strategy";
import { connect } from "react-redux";
// import { GAME_NEW } from "../store/actions";

/**
 *
 * @param {*} props.tabs=[{id:"idTab1", title:"Tab #1", class:"active", elem}, {...}, {...}]
 * @returns
 */
class Tabs extends Component {
  // static contextType = AppState;
  constructor(props) {
    super(props);
    // console.log("[Tabs.constructor()]");
    // this.state = { game: props.game };
    this.state = { name: "Tabs" };
    // console.log("[Tabs.constructor()].state", this.state);
    // console.error("[Tabs.constructor()] this.context.game", this.context.game);
    this.elTabsRef = React.createRef();
  }

  componentDidMount() {
    // console.log("[Tabs.componentDidMount()] Tabs ref:", this.elTabsRef);
    this.elTabs = M.Tabs.init(this.elTabsRef.current, {});
    if (!this.elTabs) {
      console.error("Tabs.didMount -> M.Tabs.init failed");
      return;
    }

    this.elTabs.select(this.props.tabs[0].id);
    // console.log("init", this.dlgGameChooserInstance);
  }

  doClick(stgName) {
    // console.log("[Tabs.render.doClick()]");
    // console.log("[Tabs.render.doClick()].state, props", this.state, this.props);
    if (!this.props.game) {
      console.error(`[Tabs.render()].doClick('${stgName}') No game attached`);
      return;
    }
    if (!this.props.game.data) this.props.game.getData();
    if (!this.props.game.data) {
      console.error(`[Tabs.render()].doClick('${stgName}') No Data for game:'${this.props.game.id}'`);
      return;
    }
    let stg = Strategy.find(stgName);
    Strategy.applyStrategy(stg ? [stg] : [], this.props.game);
  }

  render() {
    // console.log("[Tabs.render()].props", this.props);
    // console.log("[Tabs.render()].state, props", this.state, this.props);
    if (this.props.strategies && this.props.strategies.length > 0) {
      this.props.strategies.forEach(stg => this.doClick(stg));
      this.props.strategies.splice(0, this.props.strategies.length);
    }

    return (
      // <div id={this.props.idt ? this.props.idt : ""} className="card-panel hoverable">
      <div
        className="card-panel hoverable left-align"
        style={{ padding: "2px", display: "flex", flexDirection: "column" }}
      >
        <div className="card-tabs">
          <ul className="tabs" ref={this.elTabsRef}>
            {this.props.tabs.map((tab_, i) => {
              if (!tab_.id || tab_.id.length < 1) tab_.id = `idTab${i}`;
              if (!tab_.title || tab_.title.length < 1) tab_.title = `Tab #${i}`;
              if (!tab_.class) tab_.class = "";
              return (
                <li className="tab" key={tab_.id}>
                  <a className={tab_.class.length > 0 ? tab_.class : ""} href={"#" + tab_.id}>
                    {tab_.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="card-content grey lighten-4">
          {this.props.tabs.map((tab_, i) => (
            <div id={tab_.id} key={tab_.id + "-container"}>
              {i === 0 ? <Drawings game={this.props.game} /> : tab_.elem}
            </div>
          ))}
          <hr />
          <button onClick={this.doClick.bind(this, "oe")}> Odd/Even </button>
          <button onClick={this.doClick.bind(this, "hl")}> High/Low </button>
          <button onClick={this.doClick.bind(this, "clear")}> Clear </button>
        </div>
      </div>
    );
  }
}
const mapState2Props = state => {
  // console.log("[Tabs.mapState2Props].state", state);
  return { game: state.game, strategies: state.strategies };
};
// const mapDispatch2Props = dispatch => {
//   console.log("[LotteryHeader.mapDispatch2Props]");
//   return { onNew: g => dispatch({ type: GAME_NEW, value: g }) };
// };
export default connect(mapState2Props)(Tabs);
