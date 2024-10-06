"use client";

import { add } from "@fxts/core";
import { useReducer } from "react";

const INITIAL_COUNT = 0;

type ActionReducer<T> = (s: T, a: (n: T) => T) => T;

const reducer: ActionReducer<number> = (s, a) => a(s);

export default function Home() {
  const [state, dispatch] = useReducer(reducer, INITIAL_COUNT);
  return (
    <div>
      <h1>Count: {state}</h1>
      <button onClick={() => dispatch(add(1))}>Increment</button>
    </div>
  );
}
