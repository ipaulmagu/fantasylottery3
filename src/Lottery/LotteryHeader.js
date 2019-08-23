import React, { Component } from "react";
import DlgGamechooser from "./LotteryGameChoose";
import M from "materialize-css";
import logo from "../logo.svg";
import "./lottery.css";
import { connect } from "react-redux";
import * as ACTIONS from "../store/actions";
import Strategy from "./strategy/Strategy";
import Condition from "./strategy/Condition";

class LotteryHeader extends Component {
  constructor(props) {
    super(props);
    this.dlgGmChooserID = "dlgGmchooser1";
    this.dlgGameChooserInstance = null;
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // console.log("[LotteryHeader.constructor()].props", this.props);
    this.state = {
      // ...props
      game: this.props.game,
      img: this.props.game ? this.props.game.img : null,
      isLoggedIn: false,
      stgs: Strategy.getUserStrategies(),
      allstrategies: Strategy.strategiesDefined,
      stg: null,
      stgErrors: [],
      hasStgEditorCondErrors: false,
      hasStgEditorStgNameErrors: false,
      isStgEditing: false
    };
    this.onChangeStgName = this.onChangeStgName.bind(this);
    this.hAddStrategy = this.hAddStrategy.bind(this);
    this.hNewStrategy = this.hNewStrategy.bind(this);
    this.parseStrategy = this.parseStrategy.bind(this);
    this.hValidateConditions = this.hValidateConditions.bind(this);
    this.hValidateStgName = this.hValidateStgName.bind(this);
    this.hNewStrategy_ = this.hNewStrategy_.bind(this);
    this.getTempStrategy_ = this.getTempStrategy_.bind(this);
    // this.h = this.handleClick.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    // this.handleClick = this.handleClick.bind(this);
    this.cbGameChanged = this.cbGameChanged.bind(this);
    this.dlgStrategyEditor = null;
    this.refDlg = React.createRef();
    this.refFABStrategies = React.createRef();
    this.refDropDownMenuTrigger = React.createRef();
    this.refDropDownMenu = React.createRef();
    this.refValidateName = React.createRef();
    this.refValidateConditions = React.createRef();
    this.refUserStgMenuDivider = React.createRef();
    this.Condition = Condition;
    this.Strategy = Strategy;
    // console.log("[LotteryHeader.constructor()].state", this.state);
  }
  // static contextType = AppState;

  componentDidMount() {
    // console.log("[LotteryHeader.componentDidMount()] this.context", this.context);

    let elems = document.getElementById(this.dlgGmChooserID);
    this.dlgGameChooserInstance = M.Modal.init(elems, { inDuration: 500 });
    if (!this.dlgGameChooserInstance) {
      // console.error("[LotteryHeader.componentDidMount()] dlgFailed to Init()");
    } else {
      // this.dlgGameChooserInstance.sele
    }
    // var elFAB = document.querySelectorAll('.fixed-action-btn');
    this.btnStrategies = M.FloatingActionButton.init(this.refFABStrategies.current, {
      direction: "bottom",
      hoverEnabled: false
    });
    this.btnDropDownMenu = M.Dropdown.init(this.refDropDownMenuTrigger.current);
    elems = document.getElementById("idEditCustomStrategy");
    this.dlgStrategyEditor = M.Modal.init(elems, {
      opacity: 0.8,
      inDuration: 500,
      dismissible: true,
      onCloseStart: elDlg => {
        // console.log("[StrategyEditor.onCloseStart].elDlg", elDlg);
      },
      onOpenEnd: elDlg => {
        // console.log("[LotteryHeader.StrategyEditor.onOpenEnd].elDlg", elDlg);
        // if (!this.state.stg) this.hNewStrategy();
        // if (this.state.isStgEditing) {
        // }
      }
    });
    elems = document.getElementsByTagName("textarea");
    Array.prototype.forEach.call(elems, elem => (elem.placeholder = elem.placeholder.replace(/\\n/g, "\n")));
  }

  handleClick(event) {
    // console.log("[LotteryHeader.BreadcrumbhandleClick()]");
    event.preventDefault();
    // console.log("Click.breadcrumb.");
  }

  getGameNameStateContry(sGameName) {
    if (!sGameName) sGameName = "ga??-state?-country?";
    // console.log(typeof g, g, "- / \\>;+".split(""));
    let sep = "-/\\>;+ ".split("").filter(v => sGameName.indexOf(v) >= 0);
    if (sep) sep = sep[0] || "-";
    this.sep = sep;
    let [gname, gstate, gcountry] = sGameName.split(sep);
    gname = gname ? gname.toUpperCase() : "??";
    gstate = gstate ? gstate.substr(0, 2).toUpperCase() : "??";
    gcountry = gcountry ? gcountry.substr(0, 2).toUpperCase() : "??";
    gname = gname ? gname.toUpperCase() : "??";
    gstate = gstate ? gstate.substr(0, 2).toUpperCase() : "??";
    gcountry = gcountry ? gcountry.substr(0, 2).toUpperCase() : "??";
    // console.log(gname, gstate, gcountry);
    return [gname, gstate, gcountry];
  }
  cbGameChanged = oGame => {
    console.log("[LotteryHeader.cbGameChanged()] oGame", oGame);
    this.setState({ game: oGame, img: oGame.img });
    this.props.onGameNew(oGame);
  };
  hValidateStgName = ev => {
    let el = this.refValidateName.current;
    // let el = document.getElementById("idStrategyName");
    if (!el) return;
    let stgname = el.value;

    let errors = [];
    // if (Strategy.sysStrategyNames.includes(stgname))
    if (el.checkValidity && !el.checkValidity())
      errors.push(
        stgname.length < 1
          ? "ERROR: Strategy does not have a name yet!"
          : `ERROR: '${stgname}' name is used by a System strategy!`
      );
    // if (errors.length > 0) {
    // }
    this.setState({ stgErrors: errors, hasStgEditorStgNameErrors: errors.length > 0 });
    return errors.length > 0;
  };
  /**
   * parse text into array of conditions
   * @param {*} text conditions as text; 1 per line;
   * @param {*} errors
   */
  getConditions(text, errors) {
    if (!errors) errors = [];
    let Cond = Condition ? Condition : this.Condition;
    let conditions = text
      .split("\n")
      .filter(aline => aline.trim().length > 0)
      .map((aline, idx) => {
        let [name, def, fmt] = aline.split(";");
        if (!name) name = "";
        if (!def) def = "";
        if (!fmt) fmt = "";
        if (fmt.length > 0) {
          fmt = fmt.trim();
          fmt = fmt.indexOf("," < 0) ? [fmt] : fmt.split(",").filter(s => s.trim().length > 0);
        }
        name = name.trim();
        let aCond = {
          id: name,
          name,
          title: name.substr(0, 1),
          def: def ? def.trim() : "",
          fmt
        };
        if (aCond.name < 1) errors.push(`Cond #${idx + 1} needs a name! '${aline.substr(0, 20)}...'`);
        if (aCond.title.length < 1) errors.push(`Cond #${idx + 1} needs a Title! '${aline.substr(0, 20)}...'`);
        if (aCond.title.length < 1) errors.push(`Cond #${idx + 1} needs a Title! '${aline.substr(0, 20)}...'`);
        if (aCond.def.length < 1) errors.push(`Cond #${idx + 1} needs a def! '${aline.substr(0, 20)}...'`);
        if (aCond.fmt.length < 1)
          errors.push(`Cond #${idx + 1} needs format; i.e. 'StgOut2-1, StgCircle' '${aline.substr(0, 20)}...'`);

        return aCond;
      })
      .map(cond => new Cond(cond.id, cond.title, cond.def, cond.fmt));

    this.setState({ stgErrors: errors, hasStgEditorCondErrors: errors.length > 0 });
    return conditions;
  }

  hValidateConditions = () => {
    // let el = this.refValidateConditions.current;
    // if (!el) return;
    // el.classList.remove("Invalid");
    let errors = [];
    // let conditions = this.getConditions(el.value.trim(), errors);
    this.getConditions(this.refValidateConditions.current.value.trim(), errors);
    // if (errors.length > 0) {
    // el.classList.add("Invalid");
    // this.setState({ stgErrors: errors });
    // console.log("ERRORs Validating Conditions", errors.join("\n"));
    // }
  };

  /**
   *
   * @param {*} errors ; empty if no errors
   * @ret a temp strategy (.key = "tempkey"), modifies state.stg
   */
  parseStrategy = errors => {
    if (!errors) errors = [];
    let stg = this.state.stg;
    let elStgName = this.refValidateName.current;
    let elConditions = this.refValidateConditions.current; //document.getElementById("idStrategyName");
    if (!elConditions || !elStgName) {
      errors.push("ERROR: Unable to access UI elements! Is Your Browser misbehaving?");
      return stg;
    }
    let stgName = elStgName.value;
    if (elStgName.checkValidity && !elStgName.checkValidity())
      errors.push("ERROR: Name of Strategy is already taken by a System strategy");
    let arConds = this.getConditions(elConditions.value.trim(), errors);
    if (errors.length > 0) {
      return stg;
    } else {
      let Stg = Strategy ? Strategy : this.Strategy;

      let iCntUserStg = Stg.strategiesDefined.size - Stg.sysStrategyNames.length;
      if (!iCntUserStg || iCntUserStg < 0) iCntUserStg = 0;
      // let arConds = conditions.map(cond => new Cond(cond.id, cond.title, cond.def, cond.fmt));
      if (stg) {
        stg.assignKey(stgName);
        stg.name = stgName;
        stg.conditions = arConds;
      } else {
        stg = new Stg(stgName, "tempkey", arConds, true);
        // return stg;
      }
      this.setState({ stg: stg });
      return stg;
    }
  };

  hAddStrategy = ev => {
    let errors = [];
    let stg = this.parseStrategy(errors);
    let s = `Error adding Strategy: ${stg.name}(${stg.key})`;
    if (errors.length > 0) {
      alert(s + " Errors:\n" + errors.join("\n"));
      console.log("[LotteryHeader.AddStrategy()] " + s + " Errors:\n" + errors.join("\n"));
    } else {
      let isAdded = this.Strategy.addUserStrategy(stg);
      if (!isAdded) {
        alert(s);
        // console.log("[LotteryHeader.AddStrategy()] " + s);
      } else this.setState({ stgs: this.Strategy.getUserStrategies(), stg: stg });
      // this.hNewStrategy(null);
    }
  };

  getTempStrategy_ = () => {
    let oStg = this.state.stg;
    if (!oStg) {
      let newStgKey = "tempkey";
      //get exising tempstrategy ("tempkey")
      oStg = this.state.stgs && this.state.stgs.filter(stg => stg.key === newStgKey)[0];
      // let hasTempStg = !!tmpStg;
      if (!oStg) {
        //if tempstg does not exist make a new one
        oStg = this.hNewStrategy_(newStgKey);
      }
    }
    return oStg;
  };

  hNewStrategy_ = (newStgKey = "tempkey") => {
    //make a new strategy
    let aNewStg = new this.Strategy(
      "stg-name",
      newStgKey,
      [
        new this.Condition("idCond1", "AcceptNone", "0", ["StgOut2-1"]),
        new this.Condition("idCond2", "AcceptAll", "1", ["StgOut2-2"])
      ],
      true
    );
    // console.log("[hNewStrategy] created");
    return aNewStg;
  };

  hNewStrategy = () => {
    //dlg button.clicked to Start new strategy
    let newStgKey = "tempkey";
    let stg = this.state.stgs && this.state.stgs.filter(stg => stg.key === newStgKey)[0];
    let hasTempStg = !!stg;
    // console.log("[hNewStrategy] tempStgExists=" + hasTempStg, stg);
    if (!hasTempStg) {
      let aNewStg = this.hNewStrategy_(newStgKey);
      this.setState({ stg: aNewStg, isStgEditing: true, stgs: [aNewStg, ...this.state.stgs] });
    } else {
      this.setState({ stg: stg });
    }
  };

  onChangeStgName = ev => {
    //input box event change
    let hasErrors = this.hValidateStgName(ev);
    // let el = this.refValidateName.current;
    // if (el.checkValidity && !el.checkValidity())

    let oStg = this.getTempStrategy_();
    if (oStg) {
      oStg.key = oStg.name = ev.currentTarget.value;
    }
    this.setState({ stg: oStg, hasStgEditorStgNameErrors: hasErrors });
  };

  onChangeConditions = ev => {
    let errors = [];
    let stg = this.parseStrategy(errors);
    this.setState({ stg });
  };

  render() {
    // console.log("[LotteryHeader.render()].state, .props", this.state, this.props);
    const styles = {
      iconsettings: {
        fontSize: "0.9em",
        float: "unset",
        marginLeft: "0.5em",
        height: "inherit",
        lineHeight: "inherit"
      },
      gameLogo: {
        justifyContent: "space-between",
        alignItems: "center"
        // backgroundSize: "contain",
        // background: `url("${this.state.img}") no-repeat right`
      },
      gameLogoNav: {
        background: `
        linear-gradient(90deg, rgba(240, 120,120,0.2) 5em, rgba(240, 120, 120,0.8) 15%),
          url("${this.state.img}") no-repeat left
            `,
        backgroundSize: "contain"
      }
    };

    let elLogInOut = !this.state.isLoggedIn ? (
      <span>Login </span>
    ) : (
      <span>
        Logout <i className="material-icons right">account_circle</i>
      </span>
    );

    let [gname, gstate, gcountry] = this.getGameNameStateContry(this.state.game ? this.state.game.id : null);
    let isModStrategy = this.state.stg && this.state.stg.isModifiable;
    let oStg = this.state.stg ? this.state.allstrategies.get(this.state.stg.key) : null;
    let stgEditorStgs = [...this.state.allstrategies.values()];
    if (this.state.stg && !stgEditorStgs.includes(this.state.stg) && !oStg) {
      //if stg exists, with unique key and not curretnly being edited (different obj)

      // remove all temp strategies
      let arTempIdxs = stgEditorStgs
        .map((stg, idx) => (stg.key.substr(0, 4).toLowerCase() === "temp" ? idx : -1))
        .filter(n => n > 0);
      arTempIdxs.reverse().forEach(idx => stgEditorStgs.splice(idx, 1));
      // let tempstgidx = -1;
      // for (let i = 0, cnt = stgEditorStgs.length; i < cnt && tempstgidx < 0; i++) {
      //   let stg = stgEditorStgs[i];
      //   if (stg.key.substr(0, 4).toLowerCase() === "temp") {
      //     tempstgidx = i;
      //   }
      // }
      // if (tempstgidx >= 0) stgEditorStgs.splice(tempstgidx, 1);
      // let tempstg = stgEditorStgs.filter(stg => stg.key.substr(0, 4).toLowerCase() == "temp")[0];
      stgEditorStgs.push(this.state.stg);
    }
    stgEditorStgs
      .map(stg => stg.key)
      .sort()
      .forEach((key, idx, ar) => {
        if (idx === 0) return; //skip first
        if (key === ar[idx - 1]) console.log(`[LotteryHeader.render] Duplicate key '${key}'`);
      });

    let sConditionsText = "";
    if (
      (!this.state.isStgEditing || !this.state.stg) &&
      this.refValidateConditions.current &&
      this.refValidateConditions.current.value
    )
      sConditionsText = this.refValidateConditions.current.value;
    else if (this.state.stg) sConditionsText = this.state.stg.conditionsToString();

    return (
      <div className="col s12 m7">
        <div className="card">
          <div className="card blue-grey darken-1">
            <div className="card-stacked">
              <div className="card horizontal" style={styles.gameLogo}>
                <a href="#!" className="brand-logo">
                  <img className="LogoApp" src={logo} alt="Little Lotty Lizer" />
                </a>
                <p className="AppTittle">Fantasy Lotto</p>
                <a
                  href="#!"
                  className="waves-effect waves-light btn"
                  onClick={ev => {
                    ev.preventDefault();
                    this.props.onMaxDrawingsSet(this.state.isLoggedIn ? 10 : 30);
                    this.setState(prevState => {
                      return { isLoggedIn: !this.state.isLoggedIn };
                    });
                  }}
                >
                  {elLogInOut}
                </a>
              </div>

              <nav
                style={{
                  height: "46px",
                  lineHeight: "46px",
                  textAlign: "left",
                  paddingLeft: "7em",
                  ...styles.gameLogoNav
                }}
              >
                {/* <img className="LogoSmallLotto" src={this.state.img} alt="LogoSmallLotto" /> */}
                <a href="#!" className="breadcrumb" onClick={this.handleClick}>
                  {gcountry}
                </a>
                <a href="#!" className="breadcrumb" onClick={this.handleClick}>
                  {gstate}
                </a>
                <a
                  className="breadcrumb waves-effect waves-light modal-trigger"
                  href={"#" + this.dlgGmChooserID}
                  onClick={e => {
                    if (!this.dlgGameChooserInstance) {
                      console.log("dlg is not initialized");
                      return;
                    }
                    e.preventDefault();
                    this.dlgGameChooserInstance.open();
                  }}
                  style={{ display: "inline", verticalAlign: "inherit" }}
                >
                  <span>
                    {gname}
                    <i className="material-icons spin" style={styles.iconsettings}>
                      settings
                    </i>
                  </span>
                </a>
                {/* <a
                  className="btn-floating btn-large halfway-fab waves-effect waves-light teal"
                  href="#!"
                  data-target="dropdown1"
                  onClick={(ev)=>{}}
                >
                  <i className="material-icons">add</i>
                </a> */}

                <a
                  className="dropdown-trigger right"
                  href="#!"
                  data-target="dropdown1"
                  ref={this.refDropDownMenuTrigger}
                >
                  Strategy<i className="material-icons right">arrow_drop_down</i>
                </a>
                <ul
                  id="dropdown1"
                  className="dropdown-content"
                  ref={this.refDDMenu}
                  style={{ minWidth: "max-Content", maxHeight: "max-Content" }}
                >
                  <li key="oe">
                    <a
                      href="#!"
                      onClick={() => {
                        this.props.onStrategyAdd("oe");
                      }}
                    >
                      <i className="material-icons">directions_run</i>Odd-Even
                    </a>
                  </li>
                  <li key="hl">
                    <a href="#!" onClick={() => this.props.onStrategyAdd("hl")}>
                      <i className="material-icons">directions_run</i>High-Low
                    </a>
                  </li>
                  {this.state.stgs.map(stg => (
                    <li key={stg.key}>
                      <a href="#!" onClick={() => this.props.onStrategyAdd(stg.key)}>
                        <i className="material-icons">directions_run</i>
                        {stg.name}
                      </a>
                    </li>
                  ))}
                  <li className="divider" ref={this.refUserStgMenuDivider} />
                  <li>
                    <a
                      className="waves-effect waves-light modal-trigger"
                      href="#idEditCustomStrategy"
                      onClick={() => this.dlgStrategyEditor.open()}
                    >
                      <i className="material-icons">edit</i>Custom
                    </a>
                  </li>
                </ul>
                {/* <a className="dropdown-trigger right" href="#!" data-target="dropdown1" ref={this.refDropDownMenu}>
                  Strategy<i className="material-icons">arrow_drop_down</i>
                </a> */}
              </nav>
            </div>

            <div id="idEditCustomStrategy" className="modal">
              <div className="modal-header">
                <h4 className="Title">Strategy Editor</h4>
              </div>
              <div className="modal-content">
                <span className="StgEditMainLine1">
                  <span className="hoverable">
                    <input
                      className="ValidateMe"
                      type="text"
                      id="idStrategyName"
                      placeholder="Strategy Name i.e. Odds"
                      onChange={this.onChangeStgName}
                      required
                      // pattern={`^((?!(${Strategy.sysStrategyNames.join("\\b|")}\\b)).*)$`}
                      pattern={"^((?!(" + Strategy.sysStrategyNames.join("\\b|") + "\\b)).*)$"}
                      ref={this.refValidateName}
                      style={{ boxShadow: "0px 0px 4px 1px #0005" }}
                      value={this.state.stg ? this.state.stg.name : "stg-name?"}
                    />
                  </span>
                  <span className="StgEditorToolBar">
                    <a
                      id="idBtnNewStrategy"
                      alt="Start New Strategy"
                      onClick={this.hNewStrategy}
                      className="green-text"
                      href="#!"
                    >
                      <i className="material-icons" style={{ fontSize: "1.5em" }}>
                        note_add
                      </i>
                      New
                    </a>
                    <a
                      id="idBtnEditStrategy"
                      alt="Save Strategy if modifiable"
                      onClick={isModStrategy ? this.hAddStrategy : () => {}}
                      className={"" + (isModStrategy ? " green-text" : " disabled grey-text")}
                      href="#!"
                    >
                      <i className="material-icons" style={{ fontSize: "1.5em" }}>
                        save_alt
                      </i>
                      Save
                    </a>
                    <select
                      id="idStrategies"
                      onChange={ev => {
                        ev.preventDefault();
                        // let stgkey = ev.currentTarget.value;
                        // let Stg = Strategy ? Strategy : this.Strategy;
                        // let ostg = Stg.find(stgkey);
                        let ostg = this.Strategy.find(ev.currentTarget.value);
                        // alert("1:" + stgkey + "\n2:" + ev.target.value + "3:" + ostg.key);
                        console.log("[LotteryHeader.idStrategies.onChange]:.stg", ostg, ev);
                        if (ostg) this.setState({ stg: ostg });
                      }}
                      value={this.state.stg ? this.state.stg.key : ""}
                      style={{ display: "block" }}
                    >
                      {stgEditorStgs.map(stg => (
                        <option key={stg.key} value={stg.key}>
                          {stg.name}
                        </option>
                      ))}
                    </select>
                  </span>
                </span>
                <span>
                  <textarea
                    className={"StgEdit-Conditions hoverable" + (this.state.hasCondErrors ? " Invalid" : "")}
                    ref={this.refValidateConditions}
                    id="idEditorConditions"
                    cols="20"
                    rows="8"
                    placeholder="top3rd; (ev.n-game.min)/(game.max+1-game.min) >= 0.66667; StgOut3-1\n
                    mid;    (ev.n-game.min)/(game.max+1-game.min) >= 0.33334; StgOut3-2\n
                    bot3rd; 1;       StgOut3-3 //everythng else\n"
                    onChange={this.onChangeConditions}
                    value={sConditionsText}
                  />
                  <div
                    className="StgEditorErrorsContainer"
                    style={{ display: this.state.stgErrors.length > 0 ? "block" : "none" }}
                  >
                    {this.state.stgErrors
                      .filter((e, i) => i < 3)
                      .map((e, i) => (
                        <p className="StgEditorError" key={"stgerror#" + i}>
                          {e}
                        </p>
                      ))}
                  </div>
                </span>
              </div>
              <div className="modal-footer">
                <a href="#!" className="modal-close waves-effect waves-green btn-flat">
                  Done
                </a>
              </div>
            </div>

            <div className="body">
              <DlgGamechooser
                dlgName={this.dlgGmChooserID}
                game={this.props.game}
                cbGameChanged={this.cbGameChanged}
                ref={this.refDlg}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapState2Props = state => {
  // console.log("[LotteryHeader.mapState2Props].state", state);
  // return { game: state.gm.game, maxDrawings: state.gm.maxDrawings, strategies: state.gm.strategies };
  return { game: state.game, maxDrawings: state.maxDrawings, strategies: state.strategies };
};
const mapDispatch2Props = dispatch => {
  // console.log("[LotteryHeader.mapDispatch2Props].dispatch");
  return {
    onGameNew: game => dispatch(ACTIONS.onGameNew(game)),
    onMaxDrawingsSet: v => dispatch(ACTIONS.onMaxDrawingsSet(v)),
    onStrategyAdd: v => dispatch(ACTIONS.onStrategyAdd(v)),
    onStrategyDel: v => dispatch(ACTIONS.onStrategyDel(v))
  };
};
export default connect(
  mapState2Props,
  mapDispatch2Props
)(LotteryHeader);
