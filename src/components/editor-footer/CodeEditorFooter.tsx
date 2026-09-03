"use client";

import {type ChangeEvent, useState} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "../ui/select";
import {Input} from "../ui/input";
import {Label} from "../ui/label";
import {Button} from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {useEditorStore} from "@/store/useEditorStore";
import {Copy, EllipsisVertical, ImageIcon} from "lucide-react";
import {
  copyNodeAsImage,
  saveNodeAsPng,
  saveNodeAsSvg,
} from "@/utils/snippetExport";
import BackgroundSelect from "./BackgroundSelect";

const CODE_PADDING_OPTIONS = [4, 8, 16, 32, 64, 128];
const CODE_THEME_PRESETS = [
  {value: "snippify-midnight", label: "Midnight"},
  {value: "snippify-sand", label: "Sand"},
  {value: "snippify-emerald-night", label: "Forest"},
  {value: "snippify-carbon", label: "Mono"},
  {value: "snippify-github-dark", label: "Breeze"},
  {value: "snippify-candy", label: "Candy"},
  {value: "snippify-crimson", label: "Crimson"},
  {value: "snippify-falcon", label: "Falcon"},
  {value: "snippify-meadow", label: "Meadow"},
  {value: "snippify-raindrop", label: "Raindrop"},
  {value: "snippify-sunset", label: "Sunset"},
  {value: "snippify-bitmap", label: "Bitmap"},
  {value: "snippify-ice", label: "Ice"},
  {value: "snippify-noir", label: "Noir"},
  {value: "snippify-porcelain", label: "Porcelain (Light)"},
];

const CODE_LANGUAGES = [
  {value: "javascript", label: "JavaScript"},
  {value: "typescript", label: "TypeScript"},
  {value: "python", label: "Python"},
  {value: "java", label: "Java"},
  {value: "go", label: "Go"},
  {value: "rust", label: "Rust"},
  {value: "cpp", label: "C++"},
  {value: "csharp", label: "C#"},
  {value: "php", label: "PHP"},
  {value: "ruby", label: "Ruby"},
  {value: "sql", label: "SQL"},
  {value: "bash", label: "Bash"},
  {value: "html", label: "HTML"},
  {value: "css", label: "CSS"},
  {value: "json", label: "JSON"},
  {value: "yaml", label: "YAML"},
  {value: "xml", label: "XML"},
];

const getOptionLabel = (
  options: {value: string; label: string}[],
  value: string,
  fallback: string,
) => {
  return options.find((option) => option.value === value)?.label ?? fallback;
};

export default function CodeEditorFooter() {
  const gradient = useEditorStore((state) => state.codeGradient);
  const setGradient = useEditorStore((state) => state.setCodeGradient);

  const fontSize = useEditorStore((state) => state.fontSize);
  const setFontSize = useEditorStore((state) => state.setFontSize);
  const codePadding = useEditorStore((state) => state.codePadding);
  const setCodePadding = useEditorStore((state) => state.setCodePadding);
  const codeWindowStyle = useEditorStore((state) => state.codeWindowStyle);
  const setCodeWindowStyle = useEditorStore(
    (state) => state.setCodeWindowStyle,
  );
  const isBackgroundHidden = useEditorStore(
    (state) => state.isBackgroundHidden,
  );
  const setIsBackgroundHidden = useEditorStore(
    (state) => state.setIsBackgroundHidden,
  );
  const showLineNumbers = useEditorStore((state) => state.showLineNumbers);
  const setShowLineNumbers = useEditorStore(
    (state) => state.setShowLineNumbers,
  );
  const codeThemePreset = useEditorStore((state) => state.codeThemePreset);
  const setCodeThemePreset = useEditorStore(
    (state) => state.setCodeThemePreset,
  );
  const codeLanguage = useEditorStore((state) => state.codeLanguage);
  const setCodeLanguage = useEditorStore((state) => state.setCodeLanguage);
  const previewRef = useEditorStore((state) => state.previewRef);
  const isExporting = useEditorStore((state) => state.isExporting);
  const setIsExporting = useEditorStore((state) => state.setIsExporting);

  const [exportStatus, setExportStatus] = useState<
    "idle" | "png" | "svg" | "copy" | "error"
  >("idle");

  const runExport = async (
    action: "png" | "svg" | "copy",
    callback: () => Promise<void>,
  ) => {
    if (!previewRef) {
      return;
    }

    try {
      setIsExporting(true);
      setExportStatus("idle");
      await callback();
      setExportStatus(action);
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (error) {
      console.error("Export failed", error);
      setExportStatus("error");
      setTimeout(() => setExportStatus("idle"), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSavePng = async () => {
    await runExport("png", async () => {
      const node = previewRef as HTMLElement;
      await saveNodeAsPng(node, "code.png");
    });
  };

  const handleSaveSvg = async () => {
    await runExport("svg", async () => {
      const node = previewRef as HTMLElement;
      await saveNodeAsSvg(node, "code.svg");
    });
  };

  const handleCopyImage = async () => {
    await runExport("copy", async () => {
      const node = previewRef as HTMLElement;
      await copyNodeAsImage(node);
    });
  };

  return (
    <section className="fixed bottom-0 z-10 flex w-full justify-center">
      <div className="mx-auto flex w-full max-w-6xl justify-center">
        <div className="flex min-h-auto w-full flex-col items-center rounded-t-2xl border border-black/10 bg-white/20 px-2 py-2 text-black backdrop-blur-2xl dark:border-white/10 dark:bg-[#111010]/80 dark:text-gray-100 sm:min-h-20 sm:px-6 sm:py-4">
          <div className="flex w-full flex-wrap items-end justify-center gap-x-3 gap-y-3 lg:flex-nowrap lg:gap-x-5">
            <div className="space-y-1">
              <Label
                className="text-xs text-gray-800 dark:text-gray-200/90"
                htmlFor="gradient"
              >
                Bg Gradient
              </Label>
              <BackgroundSelect
                id="gradient"
                value={gradient}
                onChange={setGradient}
              />
            </div>
            <div className="space-y-1 flex flex-col relative">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="removeBg"
              >
                Background
              </Label>
              <Select
                value={isBackgroundHidden ? "no" : "yes"}
                onValueChange={(value: string) => {
                  setIsBackgroundHidden(value === "no");
                }}
              >
                <SelectTrigger
                  id="removeBg"
                  className="h-7 w-16 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {isBackgroundHidden ? "No" : "Yes"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex flex-col relative">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="lineNumbers"
              >
                Line Numbers
              </Label>
              <Select
                value={showLineNumbers ? "yes" : "no"}
                onValueChange={(value: string) => {
                  setShowLineNumbers(value === "yes");
                }}
              >
                <SelectTrigger
                  id="lineNumbers"
                  className="h-7 w-16 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {showLineNumbers ? "Yes" : "No"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex flex-col relative">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="codeLanguage"
              >
                Language
              </Label>
              <Select
                value={codeLanguage}
                onValueChange={(value: string) => {
                  setCodeLanguage(value);
                }}
              >
                <SelectTrigger
                  id="codeLanguage"
                  className="h-7 w-28 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {getOptionLabel(CODE_LANGUAGES, codeLanguage, "JavaScript")}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {CODE_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex flex-col relative">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="codeTheme"
              >
                Theme
              </Label>
              <Select
                value={codeThemePreset}
                onValueChange={(value: string) => {
                  setCodeThemePreset(value);
                }}
              >
                <SelectTrigger
                  id="codeTheme"
                  className="h-7 w-32 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {getOptionLabel(
                      CODE_THEME_PRESETS,
                      codeThemePreset,
                      "Midnight",
                    )}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {CODE_THEME_PRESETS.map((preset) => (
                    <SelectItem key={preset.value} value={preset.value}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex flex-col relative">
              <Label
                className="text-xs w-full text-gray-800 dark:text-gray-200/90"
                htmlFor="codeWindowStyle"
              >
                Window
              </Label>
              <Select
                value={codeWindowStyle}
                onValueChange={(value: string) => {
                  if (
                    value === "plain" ||
                    value === "macos" ||
                    value === "windows"
                  ) {
                    setCodeWindowStyle(value);
                  }
                }}
              >
                <SelectTrigger
                  id="codeWindowStyle"
                  className="h-7 w-20 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">
                    {codeWindowStyle === "macos"
                      ? "macOS"
                      : codeWindowStyle === "windows"
                        ? "Windows"
                        : "Plain"}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                  <SelectItem value="windows">Windows</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label
                className="text-xs text-gray-800 dark:text-gray-200/90"
                htmlFor="fontSize"
              >
                Font Size
              </Label>
              <Input
                id="fontSize"
                type="number"
                value={fontSize}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFontSize(parseInt(e.target.value, 10) || 14)
                }
                className="h-7 w-16 border-black/30 bg-white/80 text-center text-xs [color-scheme:dark] dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
              />
            </div>
            <div className="space-y-1">
              <Label
                className="text-xs text-gray-800 dark:text-gray-200/90"
                htmlFor="snippetPadding"
              >
                Padding
              </Label>
              <Select
                value={String(codePadding)}
                onValueChange={(value: string) =>
                  setCodePadding(parseInt(value, 10))
                }
              >
                <SelectTrigger
                  id="snippetPadding"
                  className="h-7 w-16 border-black/30 bg-white/80 text-xs dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                >
                  <span className="truncate">{codePadding}</span>
                </SelectTrigger>
                <SelectContent>
                  {CODE_PADDING_OPTIONS.map((padding) => (
                    <SelectItem key={padding} value={String(padding)}>
                      {padding}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex flex-col">
              <Label className="text-xs text-gray-800 dark:text-gray-200/90">
                Export image
              </Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    aria-label="Open export options"
                    className="h-7 w-10 border-black/30 bg-white/80 px-0 text-base font-semibold dark:border-white/15 dark:bg-[#111010]/80 dark:text-gray-100"
                  >
                    <EllipsisVertical />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[340px] border-white/10 bg-[#15171c] p-4 text-gray-100">
                  <DialogHeader>
                    <DialogTitle className="sr-only">
                      Download Options
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={handleSavePng}
                      disabled={isExporting}
                      aria-busy={isExporting}
                      aria-label="Save code snippet as PNG"
                      variant="ghost"
                      className="h-10 justify-start rounded-md px-3 text-base text-gray-100 hover:bg-white/10"
                    >
                      <span className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Save PNG
                      </span>
                    </Button>
                    <Button
                      onClick={handleSaveSvg}
                      disabled={isExporting}
                      aria-busy={isExporting}
                      aria-label="Save code snippet as SVG"
                      variant="ghost"
                      className="h-10 justify-start rounded-md px-3 text-base text-gray-100 hover:bg-white/10"
                    >
                      <span className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Save SVG
                      </span>
                    </Button>
                    <Button
                      onClick={handleCopyImage}
                      disabled={isExporting}
                      aria-busy={isExporting}
                      aria-label="Copy code snippet image"
                      variant="ghost"
                      className="h-10 justify-start rounded-md px-3 text-base text-gray-100 hover:bg-white/10"
                    >
                      <span className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        {exportStatus === "copy" ? "Copied" : "Copy Image"}
                      </span>
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <span className="pointer-events-none absolute left-0 bottom-full mb-1 whitespace-nowrap rounded bg-black/60 px-1.5 py-0.5 text-[11px] text-white dark:bg-black/70">
                {isExporting
                  ? "Exporting..."
                  : exportStatus === "png"
                    ? "PNG saved"
                    : exportStatus === "svg"
                      ? "SVG saved"
                      : exportStatus === "copy"
                        ? "Copied"
                        : exportStatus === "error"
                          ? "Export failed"
                          : ""}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
