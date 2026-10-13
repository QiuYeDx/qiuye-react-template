export interface NumberToken {
  /** 跨数值更新保持稳定的数位或格式符标识。 */
  key: string
  /** 当前槽显示的字形。 */
  text: string
}

/** 将 Intl 格式化结果拆成数位，不把字符下标误当成数位身份。 */
export function getNumberTokens(
  value: number,
  locales: string = "en-US",
  format: Intl.NumberFormatOptions = { useGrouping: false }
): { text: string; tokens: NumberToken[] } {
  const parts = new Intl.NumberFormat(locales, format).formatToParts(value)
  let place = 0
  const counts: Record<string, number> = {}
  const chunks = parts.map(() => [] as NumberToken[])
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i]
    if (part.type === "integer") {
      chunks[i] = Array.from(part.value)
        .reverse()
        .map((text) => ({
          key: "integer:" + place++,
          text,
        }))
        .reverse()
    } else if (part.type === "fraction") {
      chunks[i] = Array.from(part.value).map((text, index) => ({
        key: "fraction:" + index,
        text,
      }))
    } else if (part.type === "group") {
      chunks[i] = [{ key: "group:" + place, text: part.value }]
    } else {
      const occurrence = counts[part.type] ?? 0
      counts[part.type] = occurrence + 1
      chunks[i] = [{ key: part.type + ":" + occurrence, text: part.value }]
    }
  }
  return {
    text: parts.map((part) => part.value).join(""),
    tokens: chunks.flat(),
  }
}
