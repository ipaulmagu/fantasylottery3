import React, { Component } from "react";
import moment from "moment-timezone";
import "./strategy/strategy.css";
import { connect } from "react-redux";

class Drawings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: props.game
    };
  }
  refresh() {
    this.setState(prevState => {
      return { refresh: !prevState.refresh };
    });
  }
  render() {
    // console.log("[Drawings.render()].state, props", this.state, this.props);

    let g = this.props.game;
    if (!g || !g.data) return null;
    if (!g.data) g.getData();
    let iRowLoc = 0;
    let elems = document.querySelectorAll(".DrawingNumber");
    if (elems) {
      elems.forEach(el => {
        let classNames = [...el.classList].filter(s => s.substr(0, 3).toLowerCase() === "stg");
        classNames.forEach(c => el.classList.remove(c));
      });
      //while (el.firstChild) el.removeChild(el.firstChild);
    }
    // iColLoc = 0;
    // moment(g.data);
    return (
      <div className="DrawingContainerTab">
        {/* {console.log(g)} */}
        {this.props.game.data
          // .filter((r, i) => i < 15)
          .map((arow, irow) => {
            if (irow >= this.props.maxDrawings) return null;
            return (
              <div key={"DrawingContainer-row" + irow} className="DrawingContainer">
                <span className="DrawingDate" data-pos={`${irow},0`}>
                  {moment.tz(arow[0], "America/Los_Angeles").format("ddd MMM DD")}
                </span>
                <span className="DrawingNumbers">
                  {arow
                    // .filter((v, i) => i > 0)
                    .map((n, icol, nums) => {
                      if (icol < 1) return null;
                      return (
                        <span
                          className={
                            "DrawingNumber" + (+this.props.game.mega > 0 && icol >= nums.length - 1 ? " Mega" : "")
                          }
                          key={`DrawingNumber-col${icol}-row${irow}`}
                          data-pos={`${iRowLoc},${icol}`}
                          data-idx={`${irow},${icol}`}
                        >
                          {n}
                        </span>
                      );
                    })}
                </span>
                <br />
              </div>
            );
          })}
      </div>
    );
  }
}
const mapState2Props = state => {
  // console.log("[Drawings.mapState2Props]");
  return { game: state.game, maxDrawings: state.maxDrawings };
};
// const mapDispatch2Props = dispatch => {
//   console.log("[Drawings.mapDispatch2Props]");
//   return { onNew: g => dispatch({ type: GAME_NEW, value: g }) };
// };
export default connect(
  mapState2Props,
  null
)(Drawings);
