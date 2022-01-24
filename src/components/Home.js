import React, { useEffect, useState, useRef } from "react";
import { connect } from 'react-redux';
import { requestNewSymbol, getChartData } from '../actions/index'
import Chart from "./Chart";
import Submit from './Submit'

function Home(props){
  const [ticker, setTicker] = useState(null)
  const [chartData, setChartData] = useState([])
  const [err, setErr] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [latestTick, setLatestTick] = useState(null)
  const inputRef = useRef()
  const socket = useRef(null);

  const handleNewSymbol = (symbol) => {
    symbol = symbol.toUpperCase()
    const { dispatch } = props;
    dispatch(requestNewSymbol(symbol))
  }

  function dispatchNewChartData(){
    const { dispatch } = props;
    dispatch(getChartData(props.symbol))
  }

  useEffect(() => {
    if (ticker){
      socket.current = new WebSocket(`wss://ws.finnhub.io?token=${process.env.REACT_APP_API_KEY}`);
      socket.current.onopen = () => {
        socket.current.send(JSON.stringify({'type':'subscribe', 'symbol': ticker}))
      };

      socket.current.onmessage = e => {
        let lastPing = JSON.parse(e.data)?.data.pop()
        let newPing = { time: lastPing.t, value: lastPing.p }
        setLatestTick(newPing)
      };

      const socketCurrent = socket.current;

      return () => {
        socket.current.send(JSON.stringify({'type':'unsubscribe','symbol': ticker}))
        socketCurrent.close();
      };
    }
  }, [ticker]);

  useEffect(() => {
    if (ticker) dispatchNewChartData(ticker)
  },[ticker])

  useEffect(() => {
    if (props.allTickData.length > 0){
      setChartData(props.allTickData)
      setIsLoading(false)
    }
  },[props.allTickData])


  useEffect(() => {
    if (props.symbol) setTicker(props.symbol)
    if (props.error) {
      setErr("No matches found.")
      setIsLoading(false)
    }
  },[props])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErr(null)
    const validatedInput = inputRef.current.value.replace(/[ ]/g,'')
    if (validatedInput.length > 0) handleNewSymbol(validatedInput)
    else {
      setErr("Please enter a valid input.")
    }
  }

  return (
    <React.Fragment>
      <div className="container-fluid justify-content-center align-items-center home">
        <div className="row justify-content-center align-items-center mx-4 my-0 pt-4 main">
          <Chart allTickData={chartData} latestTick={latestTick}/>

          <div className="col d-flex justify-content-center align-items-center my-0">
              <p>{err? err : null}</p>
            </div>

          <form onSubmit={handleSubmit}>
            <div className="col d-flex justify-content-center align-items-center">
              <h1>{ticker? ticker : 'Hello'}</h1>
            </div>
            <div className="col d-flex justify-content-center align-items-center">
              <p>{ticker? null : 'Please select a ticker for real-time viewing.'}</p>
            </div>

            <div className="col d-flex justify-content-center align-items-center mt-5 mb-3">
              <input ref={inputRef} className="form-control"/>
            </div>
            <div className="col d-flex justify-content-center align-items-center">
              <Submit isLoading={isLoading}/>
            </div>
          </form>
        </div>
      </div>
    </React.Fragment>
  );
}


const mapStateToProps = state => {
  return {
    symbol: state.symbol,
    error: state.error,
    allTickData: state.allTickData
  }
}

Home = connect(mapStateToProps)(Home)

export default Home;

