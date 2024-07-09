export const arrayEquals = <T>(a1: T[], a2: T[]) =>
  a1.length === a2.length && Array.from(a1.entries()).every((e) => a2[e[0]] === e[1])
