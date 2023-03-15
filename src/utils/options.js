export const options = {
    label: data => data.id + "\n" + data.value.toFixed(2) + "%",
    value: data => Math.abs(data.value),
    group: data => data.value > 0 ? "up" : "down",
    title: data => data.id,
    link: data => `https://www.binance.com/en/trade/${data.id}_USDT`,
    width: 1024,
    height: 768,
  }