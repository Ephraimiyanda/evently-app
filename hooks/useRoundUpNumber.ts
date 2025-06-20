export function useRoundUpNumber(num: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  return Math.ceil(num * factor) / factor;
}
