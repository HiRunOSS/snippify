"use client";

import {type WheelEvent, useEffect, useMemo, useState} from "react";
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
  "gradient",
  "magic",
  "raycast",
  "radiant",
  "abstract",
  "macos",
  "windows",
  "linux",
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
  const selectedCategory =
    sortedCategories.find((category) =>
      category.options.some((item) => item.gradient === value),
    ) ?? sortedCategories[0];
  const [activeCategoryId, setActiveCategoryId] = useState(
    selectedCategory?.id ?? "",
  );
  const activeCategory =
    sortedCategories.find((category) => category.id === activeCategoryId) ??
    selectedCategory;
  const handleHorizontalWheel = (event: WheelEvent<HTMLDivElement>) => {
    const target = event.currentTarget;

    if (target.scrollWidth <= target.clientWidth) {
      return;
    }

    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (delta === 0) {
      return;
    }

    const nextScrollLeft = target.scrollLeft + delta;
    const maxScrollLeft = target.scrollWidth - target.clientWidth;

    if (
      (target.scrollLeft <= 0 && delta < 0) ||
      (target.scrollLeft >= maxScrollLeft && delta > 0)
    ) {
      return;
    }

    event.preventDefault();
    target.scrollLeft = nextScrollLeft;
  };

  useEffect(() => {
    if (selectedCategory?.id) {
      setActiveCategoryId(selectedCategory.id);
    }
  }, [selectedCategory?.id]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        id={id}
        className="flex h-7 w-16 items-center justify-center space-x-2 border-black/30 bg-white/80 dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
      >
        <div className="h-4 w-4 rounded-full" style={{background: value}} />
      </SelectTrigger>
      <SelectContent className="!w-[252px]">
        <div
          className="scrollbar-hide flex gap-1 overflow-x-auto overscroll-contain px-2 pb-2 pt-2"
          onWheel={handleHorizontalWheel}
        >
          {sortedCategories.map((category) => {
            const isActive = category.id === activeCategory.id;

            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => setActiveCategoryId(category.id)}
                className={`shrink-0 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${
                  isActive
                    ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-200"
                    : "border-black/10 bg-white/70 text-gray-600 hover:border-black/20 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:border-white/20"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="scrollbar-hide grid max-h-60 grid-cols-4 gap-2 overflow-y-auto overscroll-contain px-2 pb-2">
          {activeCategory.options.map((item) => (
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
      </SelectContent>
    </Select>
  );
}
