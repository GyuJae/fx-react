import { each, filter, find, map, pipe, take, toArray } from "@fxts/core";
import { describe, expect, test, vi } from "vitest";

describe("안전한 합성에 대해서", () => {
  test("map으로 합성하기", () => {
    const f = (x: number) => x + 10;
    const g = (x: number) => x - 5;

    const fg = (x: number) => f(g(x));

    const result = pipe([], map(fg), toArray);

    expect(result).toEqual([]); // 실행하지 않음
  });

  test("find 대신 filter 쓰기", () => {
    const users = [
      { name: "AA", age: 35 },
      { name: "BB", age: 25 },
      { name: "CC", age: 29 },
      { name: "DD", age: 19 },
      { name: "EE", age: 23 },
    ];

    const callback = vi.fn();

    const user = find((user) => user.name === "FF", users);
    if (user) {
      callback();
    }

    // vs

    pipe(
      users,
      filter((user) => user.name === "FF"),
      take(1),
      each(() => {
        callback();
      })
    );

    expect(callback).not.toHaveBeenCalled();
  });
});
