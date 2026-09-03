"use client";

import Image from "next/image";
import Link from "next/link";
import {ArrowRight} from "lucide-react";

const codeLines = [
  [
    {text: "const", color: "text-[#C792EA]"},
    {text: " theme", color: "text-[#EEFFFF]"},
    {text: " = ", color: "text-[#89DDFF]"},
    {text: '"midnight"', color: "text-[#C3E88D]"},
    {text: ";", color: "text-white"},
  ],
  [
    {text: "function", color: "text-[#C792EA]"},
    {text: " createImage", color: "text-[#82AAFF]"},
    {text: "(", color: "text-white"},
    {text: "snippet", color: "text-[#FFCB6B]"},
    {text: ") {", color: "text-white"},
  ],
  [
    {text: "  return", color: "text-[#C792EA]"},
    {text: " exportPNG", color: "text-[#82AAFF]"},
    {text: "(", color: "text-white"},
    {text: "snippet", color: "text-[#FFCB6B]"},
    {text: ");", color: "text-white"},
  ],
  [{text: "}", color: "text-white"}],
];

const imageTiles = [
  {
    src: "/sample-img/sample2.jpg",
    alt: "Screenshot tool export with framed background",
    imageClassName: "object-contain",
  },
  {
    src: "/sample-img/sample1.jpg",
    alt: "Code snippet export with macOS style frame",
    imageClassName: "object-contain",
  },
];

export default function LiveExamples() {
  return (
    <section
      className="overflow-hidden bg-white py-20 dark:bg-[#111010]"
      id="examples"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[1.65rem] border border-black/10 bg-[#111] shadow-[0_32px_100px_rgba(0,0,0,0.28)] dark:border-white/10 dark:shadow-[0_36px_120px_rgba(0,0,0,0.62)]">
          <Image
            src="/sample-img/editor.png"
            alt="Snippify editor workspace"
            width={1908}
            height={984}
            sizes="(min-width: 1024px) 1100px, 100vw"
            className="aspect-[1.9] w-full object-cover object-center"
            priority
          />
        </div>

        <div className="mb-10 mt-14 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
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

        <div className="rounded-[1.75rem] border border-black/10 bg-[#121212] p-3 shadow-[0_28px_90px_rgba(0,0,0,0.2)] dark:border-white/10 dark:shadow-[0_32px_100px_rgba(0,0,0,0.5)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-3">
            <article className="group flex min-h-[320px] items-center overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_22%_18%,rgba(68,215,205,0.85),transparent_34%),linear-gradient(135deg,#301078,#0877d9_62%,#07111f)] p-5 shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-1">
              <div className="w-full overflow-hidden rounded-2xl bg-[#020709] shadow-[0_22px_60px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition duration-500 group-hover:scale-[1.025]">
                <div className="relative flex h-10 items-center border-b border-white/10 px-4">
                  <div className="flex gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  <p className="absolute left-1/2 -translate-x-1/2 text-xs font-medium text-white/45">
                    launch.ts
                  </p>
                </div>
                <div className="px-5 py-6 font-mono text-[13px] leading-6 sm:text-sm">
                  {codeLines.map((line, index) => (
                    <div
                      key={index}
                      className="grid min-h-6 grid-cols-[2ch_1fr] gap-4"
                    >
                      <span className="select-none text-right text-white/30">
                        {index + 1}
                      </span>
                      <code className="whitespace-pre">
                        {line.map((segment, segmentIndex) => (
                          <span key={segmentIndex} className={segment.color}>
                            {segment.text}
                          </span>
                        ))}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {imageTiles.map((tile) => (
              <article
                key={tile.src}
                className="group relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] p-3 shadow-xl shadow-black/25 transition duration-300 hover:-translate-y-1"
              >
                <div className="relative h-full min-h-[296px] overflow-hidden rounded-xl bg-black/70">
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(min-width: 1024px) 340px, 100vw"
                    className={`transition duration-500 group-hover:scale-[1.03] ${tile.imageClassName}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
