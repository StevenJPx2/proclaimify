/**
 * Custom mod to fix negative modulo
 */
export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
