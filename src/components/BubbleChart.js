import { hierarchy, pack } from 'd3-hierarchy'
import { useMemo } from 'react'
import { formatarVariacao } from '@/utils/market'

// O pack do d3 agrupa as bolhas num círculo, então a área de desenho é quadrada
const LADO = 1000
const RAIO_MINIMO_COM_TEXTO = 16

export default function BubbleChart({ bolhas }) {
  // O tamanho de cada bolha é proporcional ao módulo da variação
  const folhas = useMemo(() => {
    if (bolhas.length === 0) return []
    const raiz = hierarchy({ children: bolhas }).sum((d) => Math.abs(d.variacao ?? 0))
    return pack().size([LADO, LADO]).padding(3)(raiz).leaves()
  }, [bolhas])

  return (
    <svg viewBox={`0 0 ${LADO} ${LADO}`} className="grafico" role="img"
      aria-label="Bolhas com a variação de 24 horas das criptomoedas">
      {folhas.map(({ x, y, r, data }) => {
        // Cabe o nome da moeda na largura da bolha, até um tamanho máximo
        const fonte = Math.min(r / 2.4, (1.6 * r) / (data.moeda.length * 0.62), 30)
        return (
          <a key={data.moeda} href={`https://www.binance.com/pt-BR/trade/${data.moeda}_USDT`}
            target="_blank" rel="noopener noreferrer">
            <g transform={`translate(${x},${y})`}>
              <title>{`${data.moeda}: ${formatarVariacao(data.variacao)}`}</title>
              <circle r={r} className={data.variacao >= 0 ? 'alta' : 'baixa'} />
              {r >= RAIO_MINIMO_COM_TEXTO && (
                <text textAnchor="middle" fontSize={fonte}>
                  <tspan x="0" dy="-0.1em">{data.moeda}</tspan>
                  <tspan x="0" dy="1.15em" className="percentual">{formatarVariacao(data.variacao)}</tspan>
                </text>
              )}
            </g>
          </a>
        )
      })}
    </svg>
  )
}
