"use client";

import {useEffect, useState} from "react";
import CodeSnippet from "@/components/CodeSnippet";
import ScreenshotSnippet from "@/components/ScreenshotSnippet";
import CodeEditorFooter from "@/components/editor-footer/CodeEditorFooter";
import ScreenshotEditorFooter from "@/components/editor-footer/ScreenshotEditorFooter";
import {Button} from "@/components/ui/button";
import {useEditorStore} from "@/store/useEditorStore";
import {FaGithub} from "react-icons/fa6";

const X_PROFILE_URL = "https://x.com/hiarun02";
const GITHUB_REPO_URL = "https://github.com/hiarun02/snippify";

export default function EditorPageClient() {
  const [stars, setStars] = useState<number | null>(null);
  const [displayStars, setDisplayStars] = useState(0);
  const editorMode = useEditorStore((state) => state.editorMode);
  const setEditorMode = useEditorStore((state) => state.setEditorMode);
  const hydrateFromStorage = useEditorStore(
    (state) => state.hydrateFromStorage,
  );
  const screenshotSettings = useEditorStore(
    (state) => state.screenshotSettings,
  );
  const setScreenshotSettings = useEditorStore(
    (state) => state.setScreenshotSettings,
  );

  useEffect(() => {
    hydrateFromStorage();
  }, [hydrateFromStorage]);

  useEffect(() => {
    const fetchStars = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/hiarun02/snippify",
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const data = await response.json();
        if (typeof data?.stargazers_count === "number") {
          setStars(data.stargazers_count);
        }
      } catch (error) {
        console.error("Failed to fetch GitHub stars", error);
      }
    };

    fetchStars();
  }, []);

  useEffect(() => {
    if (stars === null) {
      return;
    }

    let current = 0;
    const target = stars;
    const step = Math.max(1, Math.floor(target / 40));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplayStars(current);

      if (current >= target) {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [stars]);

  return (
    <div className="h-screen bg-gradient-to-b from-white via-white to-gray-50 dark:from-[#111010] dark:via-[#111010] dark:to-[#111010] flex flex-col overflow-hidden">
      <div className="fixed left-4 top-4 z-20 flex items-center gap-1.5 rounded-xl border border-black/10 bg-white/25 p-1 text-gray-900 shadow-sm backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/55 dark:text-white sm:left-6 sm:top-6">
        <a
          href={X_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold leading-none text-gray-800 transition-colors hover:bg-black/5 hover:text-black focus:outline-none focus:ring-1 focus:ring-blue-400 dark:text-white/85 dark:hover:bg-white/10 dark:hover:text-white"
        >
          Made by Arun
        </a>
        <a
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Star Snippify on GitHub"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold leading-none tabular-nums text-gray-700 transition-colors hover:bg-black/5 hover:text-black focus:outline-none focus:ring-1 focus:ring-blue-400 dark:text-white/75 dark:hover:bg-white/10 dark:hover:text-white"
        >
          <FaGithub className="h-3.5 w-3.5 text-gray-500 dark:text-white/55" />
          {stars === null ? (
            <span
              className="h-3 w-3 rounded-full border-2 border-gray-400 border-t-transparent animate-spin dark:border-white/45 dark:border-t-transparent"
              aria-hidden="true"
            />
          ) : (
            <span>{displayStars.toLocaleString()}</span>
          )}
        </a>
      </div>
      <div className="fixed left-1/2 top-4 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-2xl bg-white/30 p-2 backdrop-blur-2xl dark:bg-[#111010]/60 sm:top-6">
        <div className="flex w-full items-center justify-center">
          <Button
            type="button"
            aria-pressed={editorMode === "code"}
            variant={editorMode === "code" ? "outline" : "ghost"}
            className="h-9 flex-1 rounded-xl"
            onClick={() => setEditorMode("code")}
          >
            Code
          </Button>
          <Button
            type="button"
            aria-pressed={editorMode === "screenshot"}
            variant={editorMode === "screenshot" ? "outline" : "ghost"}
            className="h-9 flex-1 rounded-xl"
            onClick={() => setEditorMode("screenshot")}
          >
            Screenshot
          </Button>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center w-full overflow-hidden px-4 pb-28 pt-24 sm:pb-32 sm:pt-28">
        <div className="h-full w-full max-w-7xl rounded-3xl bg-white/20 backdrop-blur-2xl dark:bg-[#111010]/70 flex items-center justify-center overflow-hidden">
          {editorMode === "code" ? (
            <CodeSnippet />
          ) : (
            <ScreenshotSnippet settings={screenshotSettings} />
          )}
        </div>
      </main>

      {editorMode === "code" ? (
        <CodeEditorFooter />
      ) : (
        <ScreenshotEditorFooter
          settings={screenshotSettings}
          onSettingsChange={setScreenshotSettings}
        />
      )}
    </div>
  );
}
