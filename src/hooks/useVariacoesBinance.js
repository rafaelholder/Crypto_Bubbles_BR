import { useEffect, useState } from 'react'
import { atualizarVariacoes } from '@/utils/market'

// Endpoint da Binance só para dados públicos de mercado
const STREAM = 'wss://data-stream.binance.vision/ws/!miniTicker@arr'
const ESPERA_RECONEXAO_MS = 3000

export function useVariacoesBinance() {
  const [variacoes, setVariacoes] = useState(() => new Map())
  const [status, setStatus] = useState('conectando')

  useEffect(() => {
    let ws
    let reconexao
    let encerrado = false

    function conectar() {
      ws = new WebSocket(STREAM)
      ws.onopen = () => setStatus('ao vivo')
      ws.onmessage = (evento) => {
        const tickers = JSON.parse(evento.data)
        setVariacoes((atuais) => atualizarVariacoes(atuais, tickers))
      }
      ws.onclose = () => {
        if (encerrado) return
        setStatus('reconectando')
        reconexao = setTimeout(conectar, ESPERA_RECONEXAO_MS)
      }
    }

    conectar()
    return () => {
      encerrado = true
      clearTimeout(reconexao)
      ws.close()
    }
  }, [])

  return { variacoes, status }
}
