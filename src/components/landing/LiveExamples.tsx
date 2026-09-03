"use client";

import Link from "next/link";
import {ArrowRight} from "lucide-react";

const codeLines = [
  ["const", " theme ", "=", ' "midnight";'],
  ["function", " createImage", "(", "snippet", ") {"],
  ["  return", " exportPNG", "(", "snippet", ");"],
  ["}"],
];

export default function LiveExamples() {
  return (
    <section className="bg-white py-20 dark:bg-[#111010]" id="examples">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
              Live Examples
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-5xl">
              Outputs that already look ready to share
            </h2>
          </div>
          <Link
            href="/editor"
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black dark:border-white/10 dark:bg-white dark:text-black"
          >
            Create yours
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="group overflow-hidden rounded-2xl border border-black/10 bg-[radial-gradient(circle_at_20%_10%,rgba(56,207,191,0.9),transparent_34%),linear-gradient(135deg,#301078_0%,#0877d9_58%,#101827_100%)] p-6 shadow-2xl shadow-black/15 dark:border-white/10 dark:shadow-black/40 sm:p-10">
            <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl bg-black/90 shadow-[0_24px_70px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition duration-300 group-hover:-translate-y-1">
              <div className="relative flex h-11 items-center border-b border-white/10 px-5">
                <div className="flex gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <p className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-white/45">
                  launch.ts
                </p>
              </div>
              <div className="space-y-3 px-6 py-7 font-mono text-[13px] leading-6 text-white sm:px-8 sm:text-sm">
                {codeLines.map((line, index) => (
                  <div key={index} className="grid grid-cols-[2ch_1fr] gap-5">
                    <span className="select-none text-right text-white/28">
                      {index + 1}
                    </span>
                    <code>
                      <span className="text-[#7DA9AB]">{line[0]}</span>
                      <span className="text-white">{line[1]}</span>
                      <span className="text-[#F8518D]">{line[2]}</span>
                      <span className="text-[#E9AEFE]">{line[3]}</span>
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-2xl border border-black/10 bg-[#f6f7fb] p-5 shadow-xl shadow-black/10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/30">
              <div className="rotate-[-2deg] rounded-[1.35rem] border-[6px] border-white bg-white shadow-2xl shadow-blue-950/20">
                <div className="flex h-10 items-center justify-between border-b border-black/10 px-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-black">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-black text-xs">
                      S
                    </span>
                    Snippify
                  </div>
                  <div className="h-2 w-24 rounded-full bg-black/10" />
                </div>
                <div className="space-y-5 p-8 text-center">
                  <div className="mx-auto h-3 w-16 rounded-full bg-cyan-100" />
                  <p className="text-3xl font-bold tracking-tight text-black">
                    Capture. Frame. Share.
                  </p>
                  <div className="mx-auto grid max-w-xs grid-cols-3 gap-3">
                    <span className="h-16 rounded-xl bg-cyan-100" />
                    <span className="h-16 rounded-xl bg-violet-100" />
                    <span className="h-16 rounded-xl bg-amber-100" />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-black/10 bg-[linear-gradient(135deg,#fff1c7,#ff8057)] p-5 shadow-xl shadow-black/10 dark:border-white/10 dark:shadow-black/30">
              <div className="rounded-2xl bg-white/95 p-5 shadow-2xl shadow-black/20">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-700" />
                  <div>
                    <p className="text-sm font-bold text-gray-950">
                      Arun Kumar
                    </p>
                    <p className="text-xs text-gray-500">@hiarun02</p>
                  </div>
                </div>
                <p className="text-lg font-semibold leading-snug text-gray-950">
                  Turn a raw snippet or screenshot into a post-ready image in a
                  few clicks.
                </p>
                <div className="mt-5 h-28 rounded-xl bg-gradient-to-br from-[#4CC8C8] via-[#0E87E8] to-[#202033] p-4">
                  <div className="h-full rounded-lg bg-black/85" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
