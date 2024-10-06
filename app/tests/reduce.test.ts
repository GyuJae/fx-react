import {
  add,
  filter,
  gt,
  join,
  map,
  pipe,
  pluck,
  reduce,
  reject,
  split,
  toArray,
} from "@fxts/core";
import { describe, expect, test } from "vitest";

describe("명령형 습관 지우기", () => {
  const users = [
    { name: "AA", age: 35 },
    { name: "BB", age: 25 },
    { name: "CC", age: 29 },
    { name: "DD", age: 19 },
    { name: "EE", age: 23 },
  ];

  test("reduce + 복잡한 함수 + acc 보다 map + 간단한 함수 + reduce", () => {
    const result1 = reduce((total, user) => total + user.age, 0, users);

    const result2 = pipe(users, pluck("age"), reduce(add));

    expect(result1).toBe(131);
    expect(result2).toBe(131);
  });

  test("reduce 하나보다 map + filter + reduce", () => {
    const result = pipe(users, pluck("age"), filter(gt(25)), reduce(add));

    expect(result).toBe(42);
  });

  test("query1, query2", () => {
    const obj1 = {
      a: 1,
      b: undefined,
      c: "CC",
      d: "DD",
    };

    // 명령형 코드
    const query1 = (obj: Record<string, unknown>): string => {
      let res = "";
      for (const k in obj) {
        const v = obj[k];
        if (v === undefined) continue;
        if (res !== "") res += "&";
        res += k + "=" + v;
      }
      return res;
    };

    // object reduce
    const query2 = (obj: Record<string, unknown>): string => {
      return Object.entries(obj).reduce((query, [k, v], i) => {
        if (v === undefined) return query;
        return query + (i > 0 ? "&" : "") + k + "=" + v;
      }, "");
    };

    const query3 = (obj: Record<string, unknown>): string => {
      return pipe(
        obj,
        Object.entries,
        reject(([, v]) => v === undefined),
        map(join("=")),
        join("&")
      );
    };

    expect(query1(obj1)).toBe("a=1&c=CC&d=DD");
    expect(query2(obj1)).toBe("a=1&c=CC&d=DD");
    expect(query3(obj1)).toBe("a=1&c=CC&d=DD");
  });

  test("queryToObject", () => {
    const queryToObject = (query: string) => {
      return pipe(
        query,
        split("&"),
        map(split("=")),
        map(toArray),
        map(([key, value]) => ({ [key]: value })),
        reduce(Object.assign)
      );
    };

    expect(queryToObject("a=1&c=CC&d=DD")).toEqual({
      a: "1",
      c: "CC",
      d: "DD",
    });
  });
});
