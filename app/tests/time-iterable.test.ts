import {
  delay,
  each,
  flat,
  includes,
  map,
  pipe,
  pluck,
  range,
  reject,
  takeUntil,
  takeWhile,
  toArray,
  toAsync,
} from "@fxts/core";
import { describe, test } from "vitest";

describe("시간을 이터러블로 다루기", async () => {
  test("range와 take의 재해석", async () => {
    const track = [
      { cars: ["철수", "영희", "철희", "영수"] },
      { cars: ["하든", "커리", "듀란트", "탐슨"] },
      { cars: ["폴", "어빙", "릴라드", "맥컬럼"] },
      { cars: ["스파이더맨", "아이언맨"] },
      { cars: [] },
    ];

    await pipe(
      range(Infinity),
      map((i) => track[i]),
      pluck("cars"),
      takeWhile(({ length }) => length === 4),
      flat,
      toAsync,
      map((name) => delay(100, `${name} 출발!`))
      //   each(console.log)
    );
  });

  test.skip("아임포드 결제 누락 처리 스케쥴러", async () => {
    interface Payment {
      imp_id: number;
      order_id: number;
      amount: number;
    }

    const Impt = {
      payments: {
        1: [
          { imp_id: 11, order_id: 1, amount: 15000 },
          { imp_id: 12, order_id: 2, amount: 25000 },
          { imp_id: 13, order_id: 3, amount: 10000 },
        ],
        2: [
          { imp_id: 14, order_id: 4, amount: 25000 },
          { imp_id: 15, order_id: 5, amount: 45000 },
          { imp_id: 16, order_id: 6, amount: 15000 },
        ],
        3: [
          { imp_id: 17, order_id: 7, amount: 20000 },
          { imp_id: 18, order_id: 8, amount: 30000 },
        ],
        4: [] as Array<Payment>,
        5: [] as Array<Payment>,
      } as Record<number, Array<Payment>>,
      getPayments: (page: number) => {
        console.log(`http://..?page=${page}`);
        return delay(100 * 1, Impt.payments[page] as Array<Payment>);
      },
      cancelPayment: (imp_id: number) => {
        console.log(`${imp_id}: 취소완료`);
        return Promise.resolve(`${imp_id}: 취소완료`);
      },
    };

    const DB = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getOrders: (_: Array<number>) =>
        delay(100, [{ id: 1 }, { id: 3 }, { id: 7 }]),
    };

    async function job() {
      const allPayments = await pipe(
        range(1, Infinity),
        toAsync,
        map(Impt.getPayments),
        takeUntil((payments) => payments.length < 3),
        flat,
        toArray
      );

      const orderIds = await pipe(
        allPayments,
        pluck("order_id"),
        toArray,
        DB.getOrders,
        pluck("id"),
        toArray
      );

      await pipe(
        allPayments,
        reject((payment) => includes(payment.order_id, orderIds)),
        pluck("imp_id"),
        each(Impt.cancelPayment)
      );
    }
    await (async function recur(count: number) {
      if (count > 3) {
        return;
      }
      console.log(`${count}번쨰!`);
      await Promise.all([delay(3000, undefined), job()]).then(() =>
        recur(count + 1)
      );
    })(1);
  }, 10_000_000);
});
