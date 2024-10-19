export type OneToTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type NumberRangeHelper<N extends number, Result extends number[] = []> = Result["length"] extends N
  ? Result[number]
  : NumberRangeHelper<N, [...Result, Result["length"]]>;

type _FixedLengthArray<T, N extends number, R extends unknown[]> = R["length"] extends N
  ? R
  : _FixedLengthArray<T, N, [T, ...R]>;

export type FixedLengthArray<T, N extends number> = N extends N
  ? number extends N
    ? T[]
    : _FixedLengthArray<T, N, []>
  : never;

type _BoundedArray<T, Min extends number, Max extends number, R extends unknown[] = []> = R["length"] extends Max
  ? R
  : R["length"] extends Min
    ? [T, ...R] | _BoundedArray<T, Min, Max, [T, ...R]>
    : _BoundedArray<T, Min, Max, [T, ...R]> | R;

export type BoundedArray<T, Min extends number, Max extends number> =
  | [T] // no warning if there is only one element
  | (T[] & {
      0: T; // Ensures the array is not empty (minimum of 1 element)
    } & (_BoundedArray<T, Min, Max> extends infer U ? U : never));
