import React, { useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';

function Chart(props) {
  const ref = React.useRef();
  const [currentData, setCurrentData] = useState(null)
  const [currentLineSeries, setCurrentLineSeries] = useState(null)

  useEffect(() => {
    if (props.allTickData.length >= 1){
      const chart = createChart(ref.current, { 
        width: 800,
        height: 350,
        layout: {
          textColor: '#d1d4dc',
          backgroundColor: '#000000',
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.3,
            bottom: 0.25,
          },
        },
        crosshair: {
          vertLine: {
            width: 5,
            color: 'rgba(224, 227, 235, 0.1)',
            style: 0,
          },
          horzLine: {
            visible: false,
            labelVisible: false,
          },
        },
        grid: {
          vertLines: {
            color: 'rgba(42, 46, 57, 0)',
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0)',
          }
        }
      });

      if (currentData !== props.allTickData) {
        const lineSeries = chart.addLineSeries();
        setCurrentLineSeries(lineSeries)
        setCurrentData(props.allTickData)
        lineSeries.setData(
          ...props.allTickData
        );
      }
      return () => { chart.remove() } 
    }
  }, [props.allTickData]);

  function updateChartData(tick){
    try { currentLineSeries.update(tick) }
    catch (error){console.log(error)}
  }

  useEffect(() => {
    if (currentData && props.latestTick){
      const currentTick = props.latestTick;
      if (props.latestTick?.time >= currentData[0][currentData[0].length-1].time){
        updateChartData(currentTick)
      }
    }
  },[props.latestTick])

  return (
    <>
      <div ref={ref} className="d-flex justify-content-center"/>
      <p className="d-flex justify-content-center mb-0 label">{currentData ? 'Here are the most updated results through the last two weeks.' : null} </p>
    </>
  );
}

export default Chart;