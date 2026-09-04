"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {ChevronDown, ImagePlus} from "lucide-react";
import {ScreenshotSnippetBgCategories} from "@/constants/gradient";

interface BackgroundSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const CATEGORY_DISPLAY_ORDER = [
  "macos",
  "raycast",
  "mesh",
  "pattern",
  "windows",
  "linux",
  "gradient",
  "magic",
  "radiant",
  "abstract",
];
const MAX_CUSTOM_BACKGROUND_SIZE_BYTES = 3 * 1024 * 1024;

function sortBackgroundCategories() {
  return [...ScreenshotSnippetBgCategories].sort((first, second) => {
    const firstIndex = CATEGORY_DISPLAY_ORDER.indexOf(first.id);
    const secondIndex = CATEGORY_DISPLAY_ORDER.indexOf(second.id);

    if (firstIndex === -1 && secondIndex === -1) {
      return first.label.localeCompare(second.label);
    }
    if (firstIndex === -1) {
      return 1;
    }
    if (secondIndex === -1) {
      return -1;
    }

    return firstIndex - secondIndex;
  });
}

export default function BackgroundSelect({
  id,
  value,
  onChange,
}: BackgroundSelectProps) {
  const sortedCategories = useMemo(sortBackgroundCategories, []);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const handleCustomBackgroundUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Choose an image file.");
      return;
    }

    if (file.size > MAX_CUSTOM_BACKGROUND_SIZE_BYTES) {
      setUploadError("Use an image under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result;
      if (typeof imageUrl !== "string") {
        setUploadError("Could not read this image.");
        return;
      }

      setUploadError("");
      onChange(`center / cover no-repeat url("${imageUrl}")`);
      setIsOpen(false);
    };
    reader.onerror = () => {
      setUploadError("Could not read this image.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => {
          setUploadError("");
          setIsOpen((open) => !open);
        }}
        className="flex h-7 w-full items-center justify-center gap-1.5 rounded-md border border-black/30 bg-white/80 px-2 text-gray-900 dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
      >
        <span className="h-4 w-4 rounded-full" style={{background: value}} />
        <ChevronDown
          className={`h-3 w-3 text-gray-500 transition-transform dark:text-gray-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div className="absolute bottom-full left-0 z-40 mb-2 w-[252px] overflow-hidden rounded-md border border-black/20 bg-white text-black shadow-2xl shadow-black/20 dark:border-white/10 dark:bg-[#111010] dark:text-gray-100 dark:shadow-black/60">
          <div className="scrollbar-hide max-h-80 overflow-y-auto overscroll-contain px-2 py-2">
            <div className="pb-3">
              <div className="pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                Custom
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCustomBackgroundUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-dashed border-black/25 bg-black/[0.03] text-xs font-medium text-gray-700 transition hover:bg-black/[0.06] dark:border-white/20 dark:bg-white/[0.04] dark:text-gray-200 dark:hover:bg-white/[0.08]"
              >
                <ImagePlus className="h-4 w-4" />
                Upload background
              </button>
              {uploadError ? (
                <p className="mt-1 text-[11px] font-medium text-red-500 dark:text-red-300">
                  {uploadError}
                </p>
              ) : null}
            </div>

            {sortedCategories.map((category) => (
              <div key={category.id} className="pb-3 last:pb-0">
                <div className="pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                  {category.label}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {category.options.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        onChange(item.gradient);
                        setIsOpen(false);
                      }}
                      className="rounded-md p-0 outline-none focus:ring-2 focus:ring-blue-400/70"
                      aria-label={item.name}
                      title={item.name}
                    >
                      <span
                        className={`block h-10 w-10 rounded-md border ${
                          value === item.gradient
                            ? "border-blue-500 ring-2 ring-blue-400/70"
                            : "border-black/15 dark:border-white/15"
                        }`}
                        style={{background: item.gradient}}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
