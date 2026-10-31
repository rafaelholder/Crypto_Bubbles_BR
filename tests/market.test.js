import { describe, expect, it } from 'vitest'
import { atualizarVariacoes, filtrarBolhas, formatarVariacao } from '../src/utils/market.js'

const ticker = (s, o, c) => ({ s, o: String(o), c: String(c) })

describe('atualizarVariacoes', () => {
  it('calcula a variação percentual entre abertura e último preço', () => {
    const variacoes = atualizarVariacoes(new Map(), [ticker('BTCUSDT', 100, 110), ticker('ETHUSDT', 200, 150)])
    expect(variacoes.get('BTC')).toBeCloseTo(10)
    expect(variacoes.get('ETH')).toBeCloseTo(-25)
  })

  it('ignora pares fora de USDT e tokens alavancados', () => {
    const variacoes = atualizarVariacoes(new Map(), [
      ticker('ETHBTC', 1, 2),
      ticker('BTCUPUSDT', 1, 2),
      ticker('ETHDOWNUSDT', 1, 2),
      ticker('SOLUSDT', 1, 2),
    ])
    expect([...variacoes.keys()]).toEqual(['SOL'])
  })

  it('ignora preço de abertura zerado', () => {
    expect(atualizarVariacoes(new Map(), [ticker('NOVAUSDT', 0, 5)]).size).toBe(0)
  })

  it('acumula moedas entre mensagens sem alterar o mapa anterior', () => {
    const primeira = atualizarVariacoes(new Map(), [ticker('BTCUSDT', 100, 110)])
    const segunda = atualizarVariacoes(primeira, [ticker('ETHUSDT', 100, 90), ticker('BTCUSDT', 100, 120)])
    expect(primeira.get('BTC')).toBeCloseTo(10)
    expect(segunda.get('BTC')).toBeCloseTo(20)
    expect(segunda.get('ETH')).toBeCloseTo(-10)
  })
})

describe('filtrarBolhas', () => {
  const variacoes = new Map([['BTC', 2], ['ETH', -8], ['SOL', 12], ['XRP', 5]])

  it('mantém altas e quedas a partir da variação mínima, da maior para a menor', () => {
    expect(filtrarBolhas(variacoes, 5)).toEqual([
      { moeda: 'SOL', variacao: 12 },
      { moeda: 'ETH', variacao: -8 },
      { moeda: 'XRP', variacao: 5 },
    ])
  })

  it('com mínimo zero mostra todas', () => {
    expect(filtrarBolhas(variacoes, 0)).toHaveLength(4)
  })
})

describe('formatarVariacao', () => {
  it('mostra o sinal e duas casas decimais', () => {
    expect(formatarVariacao(3.14159)).toBe('+3.14%')
    expect(formatarVariacao(-0.5)).toBe('-0.50%')
    expect(formatarVariacao(0)).toBe('0.00%')
  })
})
