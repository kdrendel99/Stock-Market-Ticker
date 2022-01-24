import axios from 'axios';
import moment from 'moment'
import * as c from './ActionTypes';
//stored action creators

export const requestSymbol = () => ({
  type: c.REQUEST_SYMBOL
});

export const symbolSuccess = (symbol) => ({
  type: c.SYMBOL_SUCCESS,
  symbol
});

export const symbolFailure = (error) => ({
  type: c.SYMBOL_FAILURE,
  error
});

export const updateCandleData = (candles) => ({
  type: c.UPDATE_CANDLE_DATA,
  candles
})

const previousWeek = (moment().subtract(2, 'week').valueOf()/1000).toFixed(0)
const currentUnix = (moment().valueOf()/1000).toFixed(0)

//SYMBOL VALIDATOR
export const requestNewSymbol = (symbol) => {
  return dispatch => {
  return axios.get(`https://finnhub.io/api/v1/search?q=${symbol}&token=${process.env.REACT_APP_API_KEY}`)
  .then(
    (response) => {
      dispatch(symbolSuccess(response.data.result[0].symbol))
    })
    .catch((error) => {
      dispatch(symbolFailure(error))
    })
  }
}

//GET CHART DATA FOR VALIDATED SYMBOL
export const getChartData = (symbol) => {
  return dispatch => {
    return axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=60&token=${process.env.REACT_APP_API_KEY}&from=${previousWeek}&to=${currentUnix}`)
    .then((response) => {
      let candles = response.data
      const arr = [];

      for (let i = 0; i < candles.t.length; i++){
        const curr = candles.t[i]
        const obj = {
          time: curr,
          value: candles.c[i]
        }
        arr.push(obj)
      }
      dispatch(updateCandleData(arr))
    })
    .catch((error) => {
      dispatch(symbolFailure(error))
    })
  }
}

