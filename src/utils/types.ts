export type OneToTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type OneToFifteen = OneToTen | 11 | 12 | 13 | 14 | 15;

export type OneToOneHundred =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63
  | 64
  | 65
  | 66
  | 67
  | 68
  | 69
  | 70
  | 71
  | 72
  | 73
  | 74
  | 75
  | 76
  | 77
  | 78
  | 79
  | 80
  | 81
  | 82
  | 83
  | 84
  | 85
  | 86
  | 87
  | 88
  | 89
  | 90
  | 91
  | 92
  | 93
  | 94
  | 95
  | 96
  | 97
  | 98
  | 99
  | 100;

/**
 * recursive utility that generates a union of numbers from 0 up to N-1
 */
export type ZeroToNumberRange<N extends number, Result extends number[] = []> = Result["length"] extends N
  ? Result[number]
  : ZeroToNumberRange<N, [...Result, Result["length"]]>;

/**
 * recursive utility that generates a union of numbers from 1 up to N
 * *** don't use this for large numbers ***
 */
export type OneToNumberRange<N extends number, Result extends number[] = []> = Result["length"] extends N
  ? Exclude<Result[number], 0>
  : OneToNumberRange<N, [...Result, Result["length"]]> | N;

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
