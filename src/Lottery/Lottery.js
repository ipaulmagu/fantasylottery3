import React, { Component } from "react";
import LotteryHeader from "./LotteryHeader";
import Tabs from "./Tabs";

class Lottery extends Component {
  constructor(props) {
    super(props);
    this.idtabs = "idTabContainer1";
    // this.props = props;
    // console.log("[Lottery.constructor()]");

    // this.state = { ...this.props };
  }
  componentDidMount() {
    // console.log("[Lottery.componentDidMount()]");
  }

  tabList = [
    {
      title: "Drawings",
      class: "",
      elem: (
        <div>
          <h1>drawings</h1>
        </div>
      )
    },
    { title: "Results", elem: <h2>No Results yet!</h2> },
    { title: "Log", elem: <h2>Logging...</h2> }
  ];

  render() {
    // console.log("[Lottery.render()]");

    return (
      <div>
        <LotteryHeader />
        {/* <Tabs idt={this.idtabs} tabs={this.tabList} game={this.state.game} /> */}
        <Tabs idt={this.idtabs} tabs={this.tabList} />
      </div>
    );
  }
}

export default Lottery;
