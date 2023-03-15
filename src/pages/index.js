/* eslint-disable @next/next/no-sync-scripts */
import { WebSocketBinance } from "@/utils/webSocket"
import { useEffect, useState } from "react"




export default function Home() {
  const [variation, setVariation] = useState(10);
  
  return (
    <div>
      
      <header>
        <h1>Market </h1>
        <div>
          <input 
            placeholder="Type the variation" 
            type='number' max='100' 
            onChange={(e) => setVariation(e)} 
          >
          </input>
          {/* <button onClick={}>Set variation</button> */}
        </div>
        
      </header>
      {variation > 0 && (<WebSocketBinance variation={variation}/>)  }

    </div>
  )
}
