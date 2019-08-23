import Condition from "./Condition";

class Strategy {
  constructor(name, key, conditions, isModifiable = false) {
    this.name = name;
    this.key = key;
    this.conditions = [...conditions];
    this.isModifiable = isModifiable;
    // const cnt = this.conditions.length;
    // this.conditions.forEach((o, i) => o.fmt.push(`StgOut${cnt}-${i + 1}`));
  }

  /**
   * Globals: game{min,max,num_cnt,num_mega},ev {n,row,col,src}, r for row, c for col,
   * data for game.data, i.e. (ev.n == data[r][c]) is true
   * data[r+1][c] previous row
   */
  eval(elem, game) {
    let [r, c] = elem.dataset.idx.split(",").map(v => +v);
    let n = +elem.innerText;
    const data = game.data;
    const ev = { n, row: r, col: c, src: elem };
    for (var i = 0, cnt = this.conditions.length; i < cnt; i++) {
      const cond = this.conditions[i];
      try {
        if (eval(cond.def)) {
          let fmt = cond.fmt;
          // let isArray = Array.isArray(fmt);
          if (fmt && fmt.length > 0)
            if (elem.classList.toggle) fmt.forEach(v => elem.classList.toggle(v));
            else elem.classList.add(...fmt);
          return true;
        }
      } catch (error) {
        console.error(`*** [Strategy.eval].eval('${cond.def}') Error`);
      } //try/catch
    } //for each condition
    return false;
  } //eval
  /**
   * Assign a key if needs one; (if key is empty, starts with 'temp' or with starts with its name but new name is given
   */
  assignKey(stgName) {
    if (
      !this.key ||
      this.key.substr(0, 4) === "temp" ||
      (stgName && stgName !== this.name && this.name && this.key.substr(0, this.name.length) === this.name)
    ) {
      let skey = stgName;
      let find = this.find || Strategy.find;
      if (!find && this.Strategy) find = this.Strategy.find;
      if (!find) find = () => false;
      for (let i = 0; find(skey); skey = stgName + ++i);
      this.key = skey;
    }
  }

  getConditions() {
    if (this.conditions) {
      if (!Array.isArray(this.conditions)) {
        this.conditions = [this.conditions];
      }
      // return this.conditions.map(cond => cond.toString()).join("\n");
    } else {
      this.conditions = [];
    }
    return this.conditions;
  }
  conditionsToString() {
    // console.log(
    //   "[Strategy.conditionsToString()].conditions=" + this.conditions.map(cond => cond.toString()).join("\n")
    // );
    const s = this.getConditions()
      .map(cond => cond.toString())
      .join("\n");
    // console.log("[Strategy.conditionsToString()].conditions: '" + s + "'", this.conditions);

    return s;
  }
  toString() {
    // let scond = this.conditionsToString();
    return `${this.name}(${this.key}); cond:${this.conditionsToString()}`;
  }
  static applyStrategy(stgs, game) {
    const elemsWithNums = document.querySelectorAll(".DrawingNumbers>.DrawingNumber");
    if (elemsWithNums) {
      elemsWithNums.forEach(el => {
        if (!stgs || stgs.length == 0) {
          // let arClasses = el.classList.slice();
          // arClasses.filter(c => c.substr(0, 6) === "StgOut");
          [...el.classList].filter(c => c.substr(0, 6).toLowerCase() === "stgout").forEach(c => el.classList.remove(c));
          return;
        }
        stgs.forEach(stg => {
          stg.eval(el, game);
        });
      });
    }
  }

  static strategiesDefined; //Map
  static sysStrategyNames = []; //[]
  static find(stgkey) {
    return Strategy.strategiesDefined.get(stgkey);
  }
  static addStrategy(stg) {
    if (!Strategy.strategiesDefined) return false; // Error: undefined strategy container
    if (Strategy.find(stg.key)) return false; //Error: cannot override System strategies
    Strategy.strategiesDefined.set(stg.key, stg);
    // console.log(`[addStrategy] ${stg.key}`);

    return true;
  }

  static addUserStrategy(stg) {
    if (!Strategy.strategiesDefined) return false; // Error: undefined strategy container
    if (Strategy.sysStrategyNames.indexOf(stg.key) >= 0) return false; //Error: cannot override System strategies
    // stg.isModifiable=true;
    Strategy.strategiesDefined.set(stg.key, stg); //overwrite if there was another with same key
    console.log(`[addUserStrategy] '${stg.key}'=>`, stg);
    return true;
  }
  /**
   * @returns new Array of strategies (minus System ones)
   */
  static getUserStrategies() {
    let stgs = Array.from(Strategy.strategiesDefined.values()).filter(
      stg => !Strategy.sysStrategyNames.includes(stg.key)
    );
    return stgs;
  }
  static doStrategies() {
    if (!Strategy.strategiesDefined) Strategy.strategiesDefined = new Map();
    const oddeven = new Strategy("Odd-Even", "oe", [
      new Condition("idOdd", "O", "ev.n%2===1", ["StgOutOdd"]),
      new Condition("idEven", "E", "0", ["StgOutEven"])
    ]);
    const highlow = new Strategy("High-Low", "hl", [
      new Condition("idHigh", "H", "(ev.n-game.min)/(game.max+1-game.min) > 0.499999", ["StgOutHigh", "StgOutCircle"]),
      new Condition("idLow", "L", "0", ["StgOutLow"])
    ]);
    Strategy.addStrategy(oddeven);
    Strategy.addStrategy(highlow);
    // Strategy.strategiesDefined.set(oddeven.key, oddeven);
    // Strategy.strategiesDefined.set(highlow.key, highlow);
    Strategy.sysStrategyNames = Array.from(Strategy.strategiesDefined.keys());
  }
}
let test = `
top3rd; (ev.n-game.min)/(game.max+1-game.min) >= 0.66667; StgOut3-1
mid;    (ev.n-game.min)/(game.max+1-game.min) >= 0.33334; StgOut3-2
bot3rd; (ev.n-game.min)/(game.max+1-game.min) >= 0;       StgOut3-3
`;
Strategy.doStrategies();
export default Strategy;
