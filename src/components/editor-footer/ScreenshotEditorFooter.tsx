"use client";

import {useState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {Check, ChevronDown} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {useEditorStore} from "@/store/useEditorStore";
import {LAYOUT_PRESET_CATEGORIES} from "@/constants/layoutPresets";
import BackgroundSelect from "./BackgroundSelect";
import type {
  ScreenshotAspectRatio,
  ScreenshotLayoutPreset,
  ScreenshotSettings,
} from "@/store/useEditorStore";

interface ScreenshotEditorFooterProps {
  settings: ScreenshotSettings;
  onSettingsChange: (nextSettings: ScreenshotSettings) => void;
}

const SCREENSHOT_ASPECT_OPTIONS: Array<{
  value: ScreenshotAspectRatio;
  label: string;
}> = [
  {value: "16:9", label: "16:9"},
  {value: "3:2", label: "3:2"},
  {value: "4:3", label: "4:3"},
  {value: "5:4", label: "5:4"},
  {value: "1:1", label: "1:1"},
  {value: "4:5", label: "4:5"},
  {value: "3:4", label: "3:4"},
  {value: "2:3", label: "2:3"},
  {value: "9:16", label: "9:16"},
];

const clampImageScale = (value: number) => {
  return Number.isFinite(value) && value >= 50 && value <= 150 ? value : 100;
};

const clampCornerRadius = (value: number) => {
  return Number.isFinite(value) ? Math.max(0, Math.min(64, value)) : 16;
};

const CORNER_PRESETS: Array<{
  label: string;
  value: "sharp" | "curved" | "round";
  radius: number;
}> = [
  {label: "Sharp", value: "sharp", radius: 0},
  {label: "Curved", value: "curved", radius: 16},
  {label: "Round", value: "round", radius: 28},
];

const getCornerLabel = (radius: number) => {
  return (
    CORNER_PRESETS.find((preset) => preset.radius === radius)?.label ??
    `${radius}px`
  );
};

export default function ScreenshotEditorFooter({
  settings,
  onSettingsChange,
}: ScreenshotEditorFooterProps) {
  const gradient = useEditorStore((state) => state.screenshotGradient);
  const setGradient = useEditorStore((state) => state.setScreenshotGradient);

  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [isCornerOpen, setIsCornerOpen] = useState(false);
  const hasVisibleFrame = settings.frameStyle !== "default";
  const safeImageScale = clampImageScale(settings.imageScale);
  const safeCornerRadius = clampCornerRadius(settings.cornerRadius);

  return (
    <section className="fixed bottom-0 z-10 flex w-full justify-center">
      <div className="mx-auto flex w-full max-w-7xl justify-center">
        <div className="flex min-h-auto w-full flex-col items-center rounded-t-2xl border border-black/10 bg-white/20 px-2 py-2 text-black backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/80 dark:text-gray-100 sm:min-h-20 sm:px-6 sm:py-4">
          <div className="flex w-full flex-wrap items-end justify-center gap-x-3 gap-y-3 lg:flex-nowrap lg:justify-between lg:gap-x-4">
            <div className="w-20 space-y-1">
              <Label
                htmlFor="screenshot-gradient"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Background
              </Label>
              <BackgroundSelect
                id="screenshot-gradient"
                value={gradient}
                onChange={setGradient}
              />
            </div>

            <div className="w-20 space-y-1">
              <Label
                htmlFor="screenshot-image-scale"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Scale
              </Label>
              <Input
                id="screenshot-image-scale"
                type="number"
                min={50}
                max={150}
                value={safeImageScale}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    imageScale: clampImageScale(Number(e.target.value)),
                  })
                }
                className="h-7 w-full border-black/30 bg-white/80 text-center [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>

            <div className="w-20 space-y-1">
              <Label
                htmlFor="screenshot-background-blur"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                BG Blur
              </Label>
              <Input
                id="screenshot-background-blur"
                type="number"
                min={0}
                max={24}
                value={settings.backgroundBlur}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    backgroundBlur: Math.max(
                      0,
                      Math.min(24, Number(e.target.value) || 0),
                    ),
                  })
                }
                className="h-7 w-full border-black/30 bg-white/80 text-center [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>

            <div className="w-36 space-y-1">
              <Label
                htmlFor="screenshot-corner-trigger"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Corner
              </Label>
              <div className="relative">
                <button
                  id="screenshot-corner-trigger"
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={isCornerOpen}
                  onClick={() => setIsCornerOpen((open) => !open)}
                  className="flex h-7 w-full items-center justify-between rounded-md border border-black/30 bg-white/80 px-3 text-xs font-medium text-gray-900 dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span>{getCornerLabel(safeCornerRadius)}</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-gray-500 transition-transform dark:text-gray-300 ${
                      isCornerOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCornerOpen ? (
                  <div className="absolute bottom-full left-0 z-30 mb-2 w-64 rounded-lg border border-black/10 bg-white p-3 shadow-2xl shadow-black/20 dark:border-white/10 dark:bg-[#111010] dark:shadow-black/60">
                    <div className="grid grid-cols-3 gap-3">
                      {CORNER_PRESETS.map((preset) => {
                        const isActive = safeCornerRadius === preset.radius;

                        return (
                          <button
                            key={preset.value}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => {
                              onSettingsChange({
                                ...settings,
                                borderStyle: preset.value,
                                cornerRadius: preset.radius,
                              });
                              setIsCornerOpen(false);
                            }}
                            className={`rounded-md p-1.5 text-center transition ${
                              isActive
                                ? "bg-gray-950 text-white ring-1 ring-gray-950 dark:bg-white dark:text-black dark:ring-white"
                                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                            }`}
                          >
                            <span className="relative mx-auto mb-2 flex h-12 w-12 items-center justify-center">
                              <span className="absolute left-0 top-0 h-10 w-10 rounded-sm bg-gray-300 dark:bg-white/25" />
                              <span
                                className={`relative h-10 w-10 border ${
                                  isActive
                                    ? "border-white/75 bg-white dark:border-black/60 dark:bg-black/5"
                                    : "border-gray-300 bg-white dark:border-white/25 dark:bg-white/95"
                                }`}
                                style={{
                                  borderRadius: `${preset.radius}px`,
                                }}
                              />
                              {isActive ? (
                                <Check className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full bg-white text-black dark:bg-black dark:text-white" />
                              ) : null}
                            </span>
                            <span className="text-[11px]">{preset.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                          Custom
                        </span>
                        <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
                          {safeCornerRadius}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={64}
                        step={1}
                        value={safeCornerRadius}
                        aria-label="Custom corner radius"
                        onChange={(e) => {
                          const nextRadius = clampCornerRadius(
                            Number(e.target.value),
                          );
                          const matchingPreset = CORNER_PRESETS.find(
                            (preset) => preset.radius === nextRadius,
                          );

                          onSettingsChange({
                            ...settings,
                            borderStyle:
                              matchingPreset?.value ?? settings.borderStyle,
                            cornerRadius: nextRadius,
                          });
                        }}
                        className="h-1.5 w-full accent-gray-950 dark:accent-gray-100"
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="w-36 space-y-1">
              <Label
                htmlFor="screenshot-frame"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Border Style
              </Label>
              <Select
                value={settings.frameStyle}
                onValueChange={(
                  value:
                    | "default"
                    | "glass-light"
                    | "glass-dark"
                    | "border"
                    | "border-dark"
                    | "dashed"
                    | "dotted"
                    | "long-dash"
                    | "guide",
                ) => onSettingsChange({...settings, frameStyle: value})}
              >
                <SelectTrigger
                  id="screenshot-frame"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="glass-light">Glass Light</SelectItem>
                  <SelectItem value="glass-dark">Glass Dark</SelectItem>
                  <SelectItem value="border">Border</SelectItem>
                  <SelectItem value="border-dark">Border Dark</SelectItem>
                  <SelectItem value="dashed">Dashed</SelectItem>
                  <SelectItem value="dotted">Dotted</SelectItem>
                  <SelectItem value="long-dash">Long Dash</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-24 space-y-1">
              <Label
                htmlFor="screenshot-border-width"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Border Size
              </Label>
              <Input
                id="screenshot-border-width"
                type="number"
                min={0}
                max={24}
                value={settings.borderWidth}
                disabled={!hasVisibleFrame}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    borderWidth: Math.max(
                      0,
                      Math.min(24, Number(e.target.value) || 0),
                    ),
                  })
                }
                className="h-7 w-full border-black/30 bg-white/80 text-center [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>

            <div className="w-32 space-y-1">
              <Label
                htmlFor="screenshot-layout"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Layout
              </Label>
              <Select
                value={settings.layoutPreset}
                onValueChange={(value: ScreenshotLayoutPreset) =>
                  onSettingsChange({...settings, layoutPreset: value})
                }
              >
                <SelectTrigger
                  id="screenshot-layout"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  {LAYOUT_PRESET_CATEGORIES.map((category, categoryIndex) => (
                    <SelectGroup key={category.id}>
                      <SelectLabel className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                        {category.name}
                      </SelectLabel>
                      {category.presets.map((preset) => (
                        <SelectItem
                          key={preset.id}
                          value={preset.id as ScreenshotLayoutPreset}
                        >
                          {preset.name}
                        </SelectItem>
                      ))}
                      {categoryIndex < LAYOUT_PRESET_CATEGORIES.length - 1 ? (
                        <SelectSeparator className="mx-2 my-1 bg-black/10 dark:bg-white/10" />
                      ) : null}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-28 space-y-1">
              <Label
                htmlFor="screenshot-shadow"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Shadow
              </Label>
              <Select
                value={settings.shadowStyle}
                onValueChange={(value: "none" | "hug" | "soft" | "strong") =>
                  onSettingsChange({...settings, shadowStyle: value})
                }
              >
                <SelectTrigger
                  id="screenshot-shadow"
                  className="h-7 w-full border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="hug">Hug</SelectItem>
                  <SelectItem value="soft">Soft</SelectItem>
                  <SelectItem value="strong">Strong</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-24 flex-col space-y-1">
              <Label className="text-xs text-gray-800 dark:text-gray-200/90">
                Size
              </Label>
              <Dialog
                open={isSizeDialogOpen}
                onOpenChange={setIsSizeDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open screenshot size options"
                    className="h-7 w-full border-black/30 bg-white/80 px-2 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                  >
                    {settings.aspectRatio}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[520px] border-white/10 bg-[#15171c] p-4 text-gray-100">
                  <DialogHeader>
                    <DialogTitle>Size</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-300">
                      Standard aspect ratios based on common device screen
                      sizes.
                    </p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {SCREENSHOT_ASPECT_OPTIONS.map((option) => {
                        const isActive = settings.aspectRatio === option.value;

                        return (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={isActive}
                            aria-label={`Set aspect ratio ${option.label}`}
                            onClick={() => {
                              onSettingsChange({
                                ...settings,
                                aspectRatio: option.value,
                              });
                              setIsSizeDialogOpen(false);
                            }}
                            className={`rounded-lg border p-2 text-center transition-colors ${
                              isActive
                                ? "border-emerald-400 bg-emerald-500/10"
                                : "border-white/15 bg-white/5 hover:border-white/30"
                            }`}
                          >
                            <span className="flex h-14 items-center justify-center">
                              <span
                                className={`inline-block max-h-full max-w-full rounded-[6px] border ${
                                  isActive
                                    ? "border-emerald-300"
                                    : "border-white/30"
                                }`}
                                style={{
                                  aspectRatio: option.value.replace(":", " / "),
                                  width:
                                    option.value === "9:16" ? "24px" : "38px",
                                  height:
                                    option.value === "16:9" ? "22px" : "34px",
                                }}
                              />
                            </span>
                            <span className="mt-1 block text-xs text-gray-200">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
