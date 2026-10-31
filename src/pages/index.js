import Head from 'next/head'
import { useMemo, useState } from 'react'
import BubbleChart from '@/components/BubbleChart'
import { useVariacoesBinance } from '@/hooks/useVariacoesBinance'
import { filtrarBolhas } from '@/utils/market'

const MAX_BOLHAS = 150

export default function Home() {
  const [entrada, setEntrada] = useState('5')
  const variacaoMinima = Math.max(0, parseFloat(entrada) || 0)
  const { variacoes, status } = useVariacoesBinance()

  const bolhas = useMemo(
    () => filtrarBolhas(variacoes, variacaoMinima).slice(0, MAX_BOLHAS),
    [variacoes, variacaoMinima],
  )
  const altas = bolhas.filter((bolha) => bolha.variacao >= 0).length

  return (
    <>
      <Head>
        <title>Crypto Bubbles BR</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Variação de 24 horas das criptomoedas em tempo real, em bolhas, com dados da Binance." />
      </Head>

      <header>
        <div>
          <h1>Crypto Bubbles BR</h1>
          <p>Variação das últimas 24 horas dos pares em USDT da Binance, em tempo real</p>
        </div>
        <label>
          Variação mínima (%)
          <input type="number" inputMode="decimal" min="0" max="100" step="0.5"
            value={entrada} onChange={(e) => setEntrada(e.target.value)} />
        </label>
      </header>

      <p className="resumo">
        <span className={`status ${status === 'ao vivo' ? 'ativo' : ''}`}>{status}</span>
        {variacoes.size} moedas acompanhadas · {bolhas.length} com variação de pelo menos {variacaoMinima}%
        ({altas} em alta, {bolhas.length - altas} em queda)
      </p>

      <main>
        {bolhas.length > 0
          ? <BubbleChart bolhas={bolhas} />
          : <p className="vazio">
              {variacoes.size === 0 ? 'Aguardando os primeiros dados da Binance…' : 'Nenhuma moeda com essa variação agora. Tente um valor menor.'}
            </p>}
      </main>

      <footer>
        Dados do WebSocket público da Binance. Clique em uma bolha para abrir o par na Binance.
        {' '}<a href="https://github.com/rafaelholder/Crypto_Bubbles_BR">Código no GitHub</a>
      </footer>
    </>
  )
}
