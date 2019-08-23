import React from "react";
export const AppState = React.createContext({
  game: null,
  onChange: g => {
    console.error("[appState.onChange()]");
    this.game = g;
  } //.bind(this)
}); //app state (global vars)
// export default AppState;
