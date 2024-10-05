import {
  filter,
  join,
  map,
  pipe,
  range,
  reduce,
  repeat,
  take,
} from "@fxts/core";
import { describe, expect, test } from "vitest";

describe("FxTS Practice", () => {
  test("홀수 N개 더하기", () => {
    function takeOddN(n: number) {
      return pipe(
        range(1, Infinity),
        filter((x) => x % 2 === 1),
        take(n),
        reduce((acc, x) => acc + x)
      );
    }
    expect(takeOddN(5)).toBe(25);
    expect(takeOddN(10)).toBe(100);
  });

  test("별 그리기", () => {
    const result = pipe(
      range(1, 6),
      map((n) => repeat(n, "*")),
      map(join("")),
      join("\n")
    );
    const result2 = pipe(
      range(1, 6),
      map(range),
      map(map(() => "*")),
      map(reduce((acc, x) => `${acc}${x}`)),
      reduce((acc, x) => `${acc}\n${x}`)
    );

    expect(result).toBe(`*\n**\n***\n****\n*****`);
    expect(result2).toBe(`*\n**\n***\n****\n*****`);
  });

  test("구구단", () => {
    const result = pipe(
      range(2, 10),
      map((a) => map((b) => a * b, range(1, 10))),
      map(join(" ")),
      join("\n")
    );

    expect(result).toBe(
      "2 4 6 8 10 12 14 16 18\n3 6 9 12 15 18 21 24 27\n4 8 12 16 20 24 28 32 36\n5 10 15 20 25 30 35 40 45\n6 12 18 24 30 36 42 48 54\n7 14 21 28 35 42 49 56 63\n8 16 24 32 40 48 56 64 72\n9 18 27 36 45 54 63 72 81"
    );
  });
});
