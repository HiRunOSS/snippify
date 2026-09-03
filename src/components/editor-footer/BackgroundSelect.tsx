"use client";

import {useMemo} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {ScreenshotSnippetBgCategories} from "@/constants/gradient";

interface BackgroundSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const CATEGORY_DISPLAY_ORDER = [
  "macos",
  "windows",
  "linux",
  "raycast",
  "gradient",
  "magic",
  "radiant",
  "abstract",
];

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

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="flex h-7 w-full items-center justify-center space-x-2 border-black/30 bg-white/80 dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
      >
        <div className="h-4 w-4 rounded-full" style={{background: value}} />
      </SelectTrigger>
      <SelectContent className="!w-[252px]">
        <div className="scrollbar-hide max-h-80 overflow-y-auto overscroll-contain px-2 py-2">
          {sortedCategories.map((category) => (
            <div key={category.id} className="pb-3 last:pb-0">
              <div className="pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                {category.label}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {category.options.map((item) => (
                  <SelectItem
                    key={item.name}
                    value={item.gradient}
                    className="h-auto rounded-md p-0 pr-0"
                    aria-label={item.name}
                    title={item.name}
                  >
                    <div
                      className={`h-10 w-10 rounded-md border ${
                        value === item.gradient
                          ? "border-blue-500 ring-2 ring-blue-400/70"
                          : "border-black/15 dark:border-white/15"
                      }`}
                      style={{background: item.gradient}}
                    />
                  </SelectItem>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SelectContent>
    </Select>
  );
}
