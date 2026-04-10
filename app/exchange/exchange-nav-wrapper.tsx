"use client";

import { Nav } from "../components";
import { ExchangeNav } from "./components";

export function ExchangeNavWrapper() {
  return (
    <>
      <Nav />
      <div className="pt-[57px]">
        <ExchangeNav />
      </div>
    </>
  );
}
