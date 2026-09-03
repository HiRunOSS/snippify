"use client";

import {useState} from "react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
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
import exportAsImage, {type ImageExportFormat} from "@/utils/DownloadImage";
import {useEditorStore} from "@/store/useEditorStore";
import {EllipsisVertical} from "lucide-react";
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

export default function ScreenshotEditorFooter({
  settings,
  onSettingsChange,
}: ScreenshotEditorFooterProps) {
  const gradient = useEditorStore((state) => state.screenshotGradient);
  const setGradient = useEditorStore((state) => state.setScreenshotGradient);
  const previewRef = useEditorStore((state) => state.previewRef);
  const isExporting = useEditorStore((state) => state.isExporting);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);

  const [exportStatus, setExportStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ImageExportFormat>("png");
  const hasVisibleFrame = settings.frameStyle !== "default";

  const handleExportImage = async () => {
    if (!previewRef) {
      return;
    }

    await exportAsImage(
      previewRef,
      {
        format: exportFormat,
      },
      () => {
        setIsExporting(true);
        setExportStatus("idle");
      },
      () => {
        setIsExporting(false);
        setExportStatus("success");
        setTimeout(() => setExportStatus("idle"), 2000);
      },
      () => {
        setIsExporting(false);
        setExportStatus("error");
        setTimeout(() => setExportStatus("idle"), 3000);
      },
    );
  };

  return (
    <section className="fixed bottom-0 z-10 flex w-full justify-center">
      <div className="mx-auto flex w-full max-w-6xl justify-center">
        <div className="flex min-h-auto w-full flex-col items-center rounded-t-2xl border border-black/10 bg-white/20 px-2 py-2 text-black backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/80 dark:text-gray-100 sm:min-h-20 sm:px-6 sm:py-4">
          <div className="flex w-full flex-wrap items-end justify-center gap-x-3 gap-y-3 lg:flex-nowrap lg:gap-x-5">
            <div className="space-y-1">
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

            <div className="space-y-1">
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
                value={settings.imageScale}
                onChange={(e) =>
                  onSettingsChange({
                    ...settings,
                    imageScale: Math.max(
                      50,
                      Math.min(150, Number(e.target.value) || 100),
                    ),
                  })
                }
                className="h-7 w-14 border-black/30 bg-white/80 text-center [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>

            <div className="space-y-1">
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
                className="h-7 w-14 border-black/30 bg-white/80 text-center [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>

            <div className="space-y-1">
              <Label
                htmlFor="screenshot-border"
                className="text-xs text-gray-800 dark:text-gray-200/90"
              >
                Corner
              </Label>
              <Select
                value={settings.borderStyle}
                onValueChange={(value: "sharp" | "curved" | "round") =>
                  onSettingsChange({...settings, borderStyle: value})
                }
              >
                <SelectTrigger
                  id="screenshot-border"
                  className="h-7 w-24 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="Round" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sharp">Sharp</SelectItem>
                  <SelectItem value="curved">Curved</SelectItem>
                  <SelectItem value="round">Round</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
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
                    | "border-dark",
                ) => onSettingsChange({...settings, frameStyle: value})}
              >
                <SelectTrigger
                  id="screenshot-frame"
                  className="h-7 w-24 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <SelectValue placeholder="Default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="glass-light">Glass Light</SelectItem>
                  <SelectItem value="glass-dark">Glass Dark</SelectItem>
                  <SelectItem value="border">Border</SelectItem>
                  <SelectItem value="border-dark">Border Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
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
                className="h-7 w-16 border-black/30 bg-white/80 text-center [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>

            <div className="space-y-1">
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
                  className="h-7 w-24 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
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

            <div className="space-y-1">
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
                  className="h-7 w-20 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
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

            <div className="space-y-1 flex flex-col">
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
                    className="h-7 w-20 border-black/30 bg-white/80 px-2 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
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

            <div className="flex flex-col space-y-1">
              <Label className="text-xs text-gray-800 dark:text-gray-200/90">
                Export image
              </Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open screenshot export options"
                    className="h-7 w-10 border-black/30 bg-white/80 px-0 dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                  >
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[340px] border-white/10 bg-[#15171c] p-4 text-gray-100">
                  <DialogHeader>
                    <DialogTitle>Export Screenshot</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label
                        htmlFor="dialog-screenshot-format"
                        className="text-xs text-gray-300"
                      >
                        Format
                      </Label>
                      <Select
                        value={exportFormat}
                        onValueChange={(value: ImageExportFormat) =>
                          setExportFormat(value)
                        }
                      >
                        <SelectTrigger
                          id="dialog-screenshot-format"
                          className="h-9 border-white/15 bg-[#111010]/80 text-sm text-gray-100"
                        >
                          <SelectValue placeholder="PNG" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleExportImage}
                      disabled={isExporting}
                      aria-busy={isExporting}
                      aria-label="Download screenshot snippet"
                      variant="outline"
                      className="h-9 w-full border-white/20 bg-white/10 text-sm hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isExporting
                        ? "Exporting..."
                        : exportStatus === "success"
                          ? "Downloaded"
                          : exportStatus === "error"
                            ? "Failed"
                            : "Download"}
                    </Button>
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
