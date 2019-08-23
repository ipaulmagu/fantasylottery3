import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import gameModifier from "./store/gameModifier";
import thunk from "redux-thunk";

const logger = store => {
  return next => {
    return action => {
      console.log("[Redux Logger].action:" + action);
      const res = next(action);
      console.log(">   >>[Redux Logger].store:" + store);
      console.log(">   >>[Redux Logger].state:" + store.getState());
      return res;
    };
  };
};
// const composeDefault = f => f();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION__ || compose;
// const rootReducer = combineReducers({
//   gm: gameModifier
// });
// const store = createStore(gameModifier, composeEnhancers(applyMiddleware(logger, thunk)));
const store = createStore(gameModifier, applyMiddleware(logger));
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
