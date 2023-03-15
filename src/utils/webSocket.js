import { w3cwebsocket } from "websocket";
import { BubbleChart, options } from "./bubbleChart";


export const WebSocketBinance = ({variation}) => {
    const objData = {};
    //let variation = 12
    const WSBinance = new w3cwebsocket('wss://stream.binance.com:9443/ws/!miniTicker@arr')
    WSBinance.onmessage = (event) => {
        //console.log(event.data)
        const jsonData = JSON.parse(event.data);
        
        jsonData.filter(obj => obj.s.endsWith('USDT') 
        && !/^.{2,}(DOWN|UP)USDT$/.test(obj.s))
        .map(obj => objData[obj.s] = (parseFloat(obj.c * 100) / parseFloat(obj.o)) - 100)

        const data = Object.keys(objData).map(symbol => {
            return {
                id: symbol.replace('USDT', ''), value: objData[symbol]
            }
            })
            .filter(obj => Math.abs(obj.value) > variation) 
            
        const chart = BubbleChart(data, options);

        document.getElementById('div_chart').innerHTML = chart.outerHTML          
    }

    return(
        <div id="div_chart"></div>
    )
}