import * as c from '../actions/ActionTypes';

const initialState = {
  symbol: null,
  error: null,
  allTickData: []
}

export default (state = initialState, action) => {
  switch (action.type){
    case c.REQUEST_SYMBOL:
      return Object.assign({}, state, {
        error: null
    });
    case c.SYMBOL_SUCCESS:
      return Object.assign({}, state, {
        symbol: action.symbol,
        error: null
    });
    case c.SYMBOL_FAILURE:
      return Object.assign({}, state, {
        error: action.error
    })
    case c.UPDATE_TICKER_DATA:
      return Object.assign({}, state, {
        allTickData: [...state.allTickData, action.newTick]
    })
    case c.UPDATE_CANDLE_DATA:
      return Object.assign({}, state, {
        allTickData: [action.candles]
    })
    default:
      return state;
  }
};