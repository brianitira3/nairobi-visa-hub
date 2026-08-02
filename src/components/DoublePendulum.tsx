"use client";

import { useEffect, useRef } from "react";

const W = 600;
const H = 450;
const PX = W / 2;
const PY = 80;
const ARM = 150;
const G = 7;
const L1 = 1.5;
const L2 = 1.5;
const M1 = 1;
const M2 = 1;
const DT = 0.014;
const STEPS = 2;

function step(
  t1: number,
  t2: number,
  w1: number,
  w2: number
): { t1: number; t2: number; w1: number; w2: number } {
  const d = t1 - t2;
  const den = 2 * M1 + M2 - M2 * Math.cos(2 * d);

  const a1 =
    (-G * (2 * M1 + M2) * Math.sin(t1) -
      M2 * G * Math.sin(t1 - 2 * t2) -
      2 * Math.sin(d) * M2 * (w2 * w2 * L2 + w1 * w1 * L1 * Math.cos(d))) /
    (L1 * den);

  const a2 =
    (2 *
      Math.sin(d) *
      (w1 * w1 * L1 * (M1 + M2) +
        G * (M1 + M2) * Math.cos(t1) +
        w2 * w2 * L2 * M2 * Math.cos(d))) /
    (L2 * den);

  return {
    t1: t1 + w1 * DT,
    t2: t2 + w2 * DT,
    w1: w1 + a1 * DT,
    w2: w2 + a2 * DT,
  };
}

function randomStart() {
  return {
    t1: Math.PI * 0.55 + (Math.random() - 0.5) * 0.5,
    t2: Math.PI * 0.45 + (Math.random() - 0.5) * 0.6,
    w1: (Math.random() - 0.5) * 0.3,
    w2: (Math.random() - 0.5) * 0.3,
  };
}

export default function DoublePendulum() {
  const arm1Ref = useRef<SVGLineElement>(null);
  const arm2Ref = useRef<SVGLineElement>(null);
  const bob1Ref = useRef<SVGCircleElement>(null);
  const bob2Ref = useRef<SVGCircleElement>(null);
  const stateRef = useRef(randomStart());

  useEffect(() => {
    let running = true;

    const draw = (t1: number, t2: number) => {
      const x1 = PX + ARM * Math.sin(t1);
      const y1 = PY + ARM * Math.cos(t1);
      const x2 = x1 + ARM * Math.sin(t2);
      const y2 = y1 + ARM * Math.cos(t2);

      arm1Ref.current?.setAttribute("x2", String(x1));
      arm1Ref.current?.setAttribute("y2", String(y1));
      arm2Ref.current?.setAttribute("x1", String(x1));
      arm2Ref.current?.setAttribute("y1", String(y1));
      arm2Ref.current?.setAttribute("x2", String(x2));
      arm2Ref.current?.setAttribute("y2", String(y2));
      bob1Ref.current?.setAttribute("cx", String(x1));
      bob1Ref.current?.setAttribute("cy", String(y1));
      bob2Ref.current?.setAttribute("cx", String(x2));
      bob2Ref.current?.setAttribute("cy", String(y2));
    };

    const tick = () => {
      if (!running) return;

      for (let i = 0; i < STEPS; i++) {
        stateRef.current = step(
          stateRef.current.t1,
          stateRef.current.t2,
          stateRef.current.w1,
          stateRef.current.w2
        );
      }

      draw(stateRef.current.t1, stateRef.current.t2);
      requestAnimationFrame(tick);
    };

    draw(stateRef.current.t1, stateRef.current.t2);
    const id = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(id);
    };
  }, []);

  const reset = () => {
    stateRef.current = randomStart();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        onClick={reset}
        className="cursor-pointer rounded-2xl border border-zinc-700 bg-zinc-950"
        role="img"
        aria-label="Double pendulum simulation"
      >
        <rect width={W} height={H} fill="#09090b" />
        <line
          ref={arm1Ref}
          x1={PX}
          y1={PY}
          x2={PX}
          y2={PY + ARM}
          stroke="#fafafa"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <line
          ref={arm2Ref}
          x1={PX}
          y1={PY + ARM}
          x2={PX}
          y2={PY + ARM * 2}
          stroke="#fafafa"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={PX} cy={PY} r={7} fill="#a1a1aa" />
        <circle ref={bob1Ref} cx={PX} cy={PY + ARM} r={15} fill="#38bdf8" />
        <circle ref={bob2Ref} cx={PX} cy={PY + ARM * 2} r={17} fill="#f472b6" />
      </svg>
      <p className="text-sm text-zinc-500">click to reset with a new swing</p>
    </div>
  );
}
