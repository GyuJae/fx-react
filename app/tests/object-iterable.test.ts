import {
  add,
  entries,
  filter,
  fromEntries,
  indexBy,
  keys,
  map,
  pipe,
  pluck,
  reduce,
  take,
  toArray,
  values,
} from "@fxts/core";
import { describe, expect, test } from "vitest";

describe("객체를 이터러블 프로그래밍으로 다루기", () => {
  const obj1 = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
  };

  test("values", () => {
    const result = pipe(obj1, values, map(add(10)), take(2), reduce(add));

    expect(result).toBe(23);
  });

  test("entries", () => {
    const result = pipe(
      obj1,
      entries,
      map(([key, value]) => ({ [value]: key })),
      toArray,
      Object.assign
    );

    expect(result).toEqual([
      {
        1: "a",
      },
      {
        2: "b",
      },
      {
        3: "c",
      },
      {
        4: "d",
      },
    ]);
  });

  test("keys", () => {
    const result = pipe(obj1, keys, toArray);

    expect(result).toEqual(["a", "b", "c", "d"]);
  });

  test("어떠한 값이든 이터러블 프로그래밍으로 다루기", () => {
    const users = [
      { id: 1, name: "AA", age: 35 },
      { id: 2, name: "BB", age: 25 },
      { id: 3, name: "CC", age: 29 },
      { id: 4, name: "DD", age: 19 },
      { id: 5, name: "EE", age: 23 },
    ];

    const usersIndexById = indexBy((user) => user.id, users);

    pipe(
      usersIndexById,
      entries,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      filter(([, { age }]) => age < 30),
      take(2),
      fromEntries
    );
  });

  test("Model, Collection", () => {
    class Product {
      private constructor(
        private readonly _name: string,
        private readonly _price: number
      ) {}

      static of(name: string, price: number): Product {
        return new Product(name, price);
      }

      get name() {
        return this._name;
      }

      get price() {
        return this._price;
      }
    }

    class Products {
      private constructor(private readonly _items: Iterable<Product>) {}

      static of(products: Iterable<Product>): Products {
        return new Products(products);
      }

      get totalPrice(): number {
        return pipe(this._items, pluck("price"), reduce(add));
      }
    }

    const products = Products.of([
      Product.of("신발", 5_000),
      Product.of("옷", 10_000),
    ]);

    expect(products.totalPrice).toBe(15_000);
  });
});
