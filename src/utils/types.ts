export type OneToTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type _FixedLengthArray<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _FixedLengthArray<T, N, [T, ...R]>;

export type FixedLengthArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _FixedLengthArray<T, N, []>
  : never;
