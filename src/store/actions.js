export const GAME_NEW = "GAME_NEW";
export const USER_NEW = "USER_NEW";
export const MAX_DRAWINGS_SET = "MAX_DRAWINGS_SET";
export const STRATEGY_ADD = "STRATEGY_ADD";
export const STRATEGY_DEL = "STRATEGY_DEL";

export const onUserNew = user => {
  return { type: USER_NEW, user };
};
export const onGameNew = game => {
  return { type: GAME_NEW, game };
};
export const onMaxDrawingsSet = v => {
  return { type: MAX_DRAWINGS_SET, v };
};
export const onStrategyAdd = v => {
  return { type: STRATEGY_ADD, v };
};
export const onStrategyDel = v => {
  return { type: STRATEGY_DEL, v };
};

export const onUserNewAsync = user => {
  return (dispatch, getState) => {
    setTimeout(() => dispatch(onUserNew(user)), 2000);
  };
};
export const onGameNewAsync = game => {
  return (dispatch, getState) => {
    // const oldGame = getState().gm.game;
    // setTimeout(() => dispatch({...onGameNew(game), oldGame}), 2000);
    setTimeout(() => dispatch(onGameNew(game)), 2000);
  };
};
export const onMaxDrawingsSetAsync = v => {
  return dispatch => {
    setTimeout(() => dispatch(onMaxDrawingsSet(v)), 2000);
  };
};
export const onStrategyAddAsync = v => {
  return dispatch => {
    setTimeout(() => dispatch(onStrategyAdd(v)), 2000);
  };
};
export const onStrategyDelAsync = v => {
  return dispatch => {
    setTimeout(() => dispatch(onStrategyDel(v)), 2000);
  };
};
// export const onGameNew = dispatch => {
//   return game => dispatch(onGameNewAction(game));
// };
