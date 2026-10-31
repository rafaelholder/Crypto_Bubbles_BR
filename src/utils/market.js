// Tokens alavancados da Binance (BTCUPUSDT, ETHDOWNUSDT...) distorcem o gráfico
const ALAVANCADOS = /^.{2,}(UP|DOWN)USDT$/

/**
 * Aplica uma mensagem do stream !miniTicker@arr ao mapa moeda → variação de 24 h (%).
 * O stream só envia as moedas que mudaram no último segundo, por isso o mapa acumula.
 */
export function atualizarVariacoes(variacoes, tickers) {
  const novas = new Map(variacoes)
  for (const ticker of tickers) {
    if (!ticker.s.endsWith('USDT') || ALAVANCADOS.test(ticker.s)) continue
    const abertura = parseFloat(ticker.o)
    if (!(abertura > 0)) continue
    novas.set(ticker.s.slice(0, -'USDT'.length), (parseFloat(ticker.c) / abertura - 1) * 100)
  }
  return novas
}

/** Moedas cuja variação, em módulo, chega ao mínimo, da maior para a menor. */
export function filtrarBolhas(variacoes, variacaoMinima) {
  return [...variacoes]
    .filter(([, variacao]) => Math.abs(variacao) >= variacaoMinima)
    .map(([moeda, variacao]) => ({ moeda, variacao }))
    .sort((a, b) => Math.abs(b.variacao) - Math.abs(a.variacao))
}

export function formatarVariacao(variacao) {
  return `${variacao > 0 ? '+' : ''}${variacao.toFixed(2)}%`
}
