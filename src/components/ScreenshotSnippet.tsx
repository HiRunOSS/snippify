"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {useDropzone, type FileRejection} from "react-dropzone";
import {
  useEditorStore,
  type ScreenshotAspectRatio,
  type ScreenshotSettings,
} from "@/store/useEditorStore";
import {
  DEFAULT_LAYOUT_PRESET,
  getLayoutTransform,
} from "@/constants/layoutPresets";

interface ScreenshotSnippetProps {
  settings: ScreenshotSettings;
}

const ASPECT_RATIO_VALUE_MAP: Record<ScreenshotAspectRatio, string> = {
  "16:9": "16 / 9",
  "3:2": "3 / 2",
  "4:3": "4 / 3",
  "5:4": "5 / 4",
  "1:1": "1 / 1",
  "4:5": "4 / 5",
  "3:4": "3 / 4",
  "2:3": "2 / 3",
  "9:16": "9 / 16",
};

const ASPECT_RATIO_NUMBER_MAP: Record<ScreenshotAspectRatio, number> = {
  "16:9": 16 / 9,
  "3:2": 3 / 2,
  "4:3": 4 / 3,
  "5:4": 5 / 4,
  "1:1": 1,
  "4:5": 4 / 5,
  "3:4": 3 / 4,
  "2:3": 2 / 3,
  "9:16": 9 / 16,
};

const BACKGROUND_PADDING = "clamp(28px, 4.5vw, 64px)";
const MAX_PREVIEW_WIDTH_PX = 1200;
const MAX_IMAGE_SIZE_BYTES = 12 * 1024 * 1024;

export default function ScreenshotSnippet({settings}: ScreenshotSnippetProps) {
  const gradient = useEditorStore((state) => state.screenshotGradient);
  const setPreviewRef = useEditorStore((state) => state.setPreviewRef);
  const uploadedImage = useEditorStore((state) => state.uploadedImage);
  const setUploadedImage = useEditorStore((state) => state.setUploadedImage);
  const setScreenshotSettings = useEditorStore(
    (state) => state.setScreenshotSettings,
  );
  const previewViewportRef = useRef<HTMLElement | null>(null);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteCaptureError, setWebsiteCaptureError] = useState("");
  const [isCapturingWebsite, setIsCapturingWebsite] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(MAX_PREVIEW_WIDTH_PX);
  const imageSrc = uploadedImage;
  const safeImageScale = Math.max(50, Math.min(settings.imageScale, 150));
  const safeBackgroundBlur = Math.max(
    0,
    Math.min(settings.backgroundBlur, 24),
  );
  const aspectRatioValue =
    ASPECT_RATIO_VALUE_MAP[settings.aspectRatio] ??
    ASPECT_RATIO_VALUE_MAP["16:9"];
  const aspectRatioNumber =
    ASPECT_RATIO_NUMBER_MAP[settings.aspectRatio] ??
    ASPECT_RATIO_NUMBER_MAP["16:9"];

  const borderRadius = Math.max(0, Math.min(64, settings.cornerRadius));
  const hasVisibleFrame = settings.frameStyle !== "default";
  const isSolidBorderFrame =
    settings.frameStyle === "border" || settings.frameStyle === "border-dark";
  const safeBorderWidthPx = Math.max(0, Math.min(settings.borderWidth, 24));
  const solidBorderWidthPx = isSolidBorderFrame ? safeBorderWidthPx : 0;
  const frameInsetWidthPx = hasVisibleFrame ? safeBorderWidthPx : 0;
  const frameRadius = hasVisibleFrame
    ? borderRadius + frameInsetWidthPx
    : borderRadius;

  const getFrameStyles = () => {
    return {
      borderRadius: `${frameRadius}px`,
      backgroundImage: "none",
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  };

  const getScreenshotWrapperStyles = (): React.CSSProperties => {
    switch (settings.frameStyle) {
      case "glass-light":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px solid rgba(255, 255, 255, 0.62)`,
          backgroundColor: "transparent",
        };
      case "glass-dark":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px solid rgba(255, 255, 255, 0.26)`,
          backgroundColor: "transparent",
        };
      case "border":
        return {
          padding: `${solidBorderWidthPx}px`,
          border: "none",
          backgroundColor: "rgb(255, 255, 255)",
        };
      case "border-dark":
        return {
          padding: `${solidBorderWidthPx}px`,
          border: "none",
          backgroundColor: "rgb(26, 26, 26)",
        };
      case "dashed":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px dashed rgba(255, 255, 255, 0.46)`,
          backgroundColor: "transparent",
        };
      case "dotted":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px dotted rgba(255, 255, 255, 0.58)`,
          backgroundColor: "transparent",
        };
      case "long-dash":
        return {
          padding: "0px",
          border: `${safeBorderWidthPx}px dashed rgba(226, 232, 240, 0.68)`,
          backgroundColor: "transparent",
          outline: "1px solid rgba(15, 23, 42, 0.2)",
          outlineOffset: `${Math.max(4, safeBorderWidthPx + 2)}px`,
        };
      case "guide":
        return {
          padding: "0px",
          border: `${Math.max(1, safeBorderWidthPx)}px dashed rgba(148, 163, 184, 0.82)`,
          backgroundColor: "transparent",
          boxShadow:
            "0 0 0 6px rgba(15, 23, 42, 0.16), 0 0 0 7px rgba(226, 232, 240, 0.36)",
        };
      case "default":
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getScreenshotShadowStyles = (): React.CSSProperties => {
    switch (settings.shadowStyle) {
      case "hug":
        return {
          filter: "drop-shadow(0 8px 14px rgba(15, 23, 42, 0.26))",
          boxShadow:
            "0 1px 3px rgba(15, 23, 42, 0.14), 0 6px 14px rgba(15, 23, 42, 0.2)",
        };
      case "soft":
        return {
          filter:
            "drop-shadow(0 14px 28px rgba(15, 23, 42, 0.28)) drop-shadow(0 4px 10px rgba(15, 23, 42, 0.16))",
          boxShadow:
            "0 4px 12px rgba(15, 23, 42, 0.16), 0 14px 30px -6px rgba(15, 23, 42, 0.3)",
        };
      case "strong":
        return {
          filter:
            "drop-shadow(0 24px 48px rgba(15, 23, 42, 0.38)) drop-shadow(0 8px 18px rgba(15, 23, 42, 0.24))",
          boxShadow:
            "0 8px 20px rgba(15, 23, 42, 0.2), 0 24px 54px -10px rgba(15, 23, 42, 0.36)",
        };
      case "none":
      default:
        return {
          filter: "none",
          boxShadow: "none",
        };
    }
  };

  const getFrameBorderWidthPx = () => {
    switch (settings.frameStyle) {
      case "glass-light":
      case "glass-dark":
      case "dashed":
      case "dotted":
      case "long-dash":
      case "guide":
        return safeBorderWidthPx;
      case "border":
      case "border-dark":
        return solidBorderWidthPx;
      case "default":
      default:
        return 0;
    }
  };

  const getLayoutPresetStyles = (): React.CSSProperties => {
    if (
      settings.layoutPreset === DEFAULT_LAYOUT_PRESET &&
      safeImageScale === 100
    ) {
      return {
        transform: "none",
      };
    }

    return {
      transform: `${getLayoutTransform(settings.layoutPreset)} scale(${
        safeImageScale / 100
      })`,
      transformOrigin: "center",
    };
  };

  const frameBorderWidthPx = getFrameBorderWidthPx();
  const innerImageRadiusPx =
    hasVisibleFrame
      ? borderRadius
      : Math.max(borderRadius - frameBorderWidthPx, 0);

  const processUploadedFile = useCallback(
    (file: File | null | undefined) => {
      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        window.alert("Please upload an image file.");
        return;
      }

      // Keep persisted payloads within practical localStorage bounds.
      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        window.alert(
          "Please upload an image under 12MB for reliable persistence.",
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setUploadedImage(base64);
      };
      reader.readAsDataURL(file);
    },
    [setUploadedImage],
  );

  const importImageBlob = useCallback(
    (blob: Blob) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          setUploadedImage(reader.result as string);
          resolve();
        };
        reader.onerror = () => {
          reject(new Error("Unable to read captured screenshot."));
        };
        reader.readAsDataURL(blob);
      });
    },
    [setUploadedImage],
  );

  const normalizeWebsiteUrl = (rawUrl: string) => {
    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) {
      return "";
    }

    return /^https?:\/\//i.test(trimmedUrl)
      ? trimmedUrl
      : `https://${trimmedUrl}`;
  };

  const handleWebsiteCapture = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const normalizedUrl = normalizeWebsiteUrl(websiteUrl);
    if (!normalizedUrl) {
      setWebsiteCaptureError("Enter a website URL.");
      return;
    }

    setIsCapturingWebsite(true);
    setWebsiteCaptureError("");

    try {
      const response = await fetch(
        `/api/website-screenshot?url=${encodeURIComponent(normalizedUrl)}`,
      );
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | {error?: string}
          | null;
        throw new Error(payload?.error ?? "Could not capture this website.");
      }

      const blob = await response.blob();
      await importImageBlob(blob);
      setScreenshotSettings({
        ...settings,
        aspectRatio: "16:9",
        imageScale: 100,
        layoutPreset: DEFAULT_LAYOUT_PRESET,
      });
      setWebsiteUrl("");
    } catch (error) {
      setWebsiteCaptureError(
        error instanceof Error
          ? error.message
          : "Could not capture this website.",
      );
    } finally {
      setIsCapturingWebsite(false);
    }
  };

  const handleDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      processUploadedFile(acceptedFiles[0]);
    },
    [processUploadedFile],
  );

  const handleDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const firstErrorCode = fileRejections[0]?.errors[0]?.code;

    if (firstErrorCode === "file-too-large") {
      window.alert(
        "Please upload an image under 12MB for reliable persistence.",
      );
      return;
    }

    if (firstErrorCode === "file-invalid-type") {
      window.alert("Please upload an image file.");
      return;
    }

    window.alert("Unable to upload this file. Please try a different image.");
  }, []);

  const {getRootProps, getInputProps, isDragActive, open} = useDropzone({
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: MAX_IMAGE_SIZE_BYTES,
    noClick: true,
    noKeyboard: true,
    onDropAccepted: handleDropAccepted,
    onDropRejected: handleDropRejected,
  });

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pastedFile = event.clipboardData?.files?.[0];
      if (!pastedFile) {
        return;
      }

      event.preventDefault();
      processUploadedFile(pastedFile);
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [processUploadedFile]);

  useEffect(() => {
    const viewport = previewViewportRef.current;
    if (!viewport) {
      return;
    }

    const updatePreviewWidth = () => {
      const {height, width} = viewport.getBoundingClientRect();
      const nextWidth = Math.max(
        240,
        Math.min(MAX_PREVIEW_WIDTH_PX, width, height * aspectRatioNumber),
      );
      setPreviewWidth(Math.round(nextWidth));
    };

    updatePreviewWidth();

    const resizeObserver = new ResizeObserver(updatePreviewWidth);
    resizeObserver.observe(viewport);
    window.addEventListener("resize", updatePreviewWidth);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePreviewWidth);
    };
  }, [aspectRatioNumber]);

  return (
    <section
      ref={previewViewportRef}
      className="flex h-full w-full flex-col items-center justify-center gap-5 px-1 sm:gap-6"
    >
      <div
        ref={setPreviewRef}
        data-export-sharp-border="true"
        className="relative mx-auto box-border overflow-hidden rounded-lg"
        style={{
          aspectRatio: aspectRatioValue,
          backgroundColor: "#111010",
          padding: BACKGROUND_PADDING,
          width: `${previewWidth}px`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: gradient,
          }}
        />
        {safeBackgroundBlur > 0 ? (
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background: gradient,
              filter: `blur(${safeBackgroundBlur}px)`,
            }}
          />
        ) : null}

        <div
          {...getRootProps({
            "data-export-sharp-border": "true",
            className: "relative z-10 h-full w-full",
          })}
          style={{
            ...getFrameStyles(),
            overflow: imageSrc ? "visible" : "hidden",
          }}
        >
          <input {...getInputProps({"aria-label": "Upload screenshot"})} />

          <div
            className="absolute flex items-center justify-center"
            style={{
              inset: 0,
              borderRadius: `${frameRadius}px`,
              overflow: imageSrc ? "visible" : "hidden",
            }}
          >
            {imageSrc ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Screenshot preview"
                  className="block"
                  data-layout-effect="true"
                  data-layout-preset={settings.layoutPreset}
                  data-image-scale={safeImageScale}
                  data-shadow-style={settings.shadowStyle}
                  data-frame-style={settings.frameStyle}
                  style={{
                    borderRadius: `${innerImageRadiusPx}px`,
                    boxSizing: "border-box",
                    height: "auto",
                    imageRendering: "auto",
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                    objectPosition: "center",
                    transition:
                      "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), filter 260ms cubic-bezier(0.22, 1, 0.36, 1)",
                    width: "auto",
                    ...getLayoutPresetStyles(),
                    ...getScreenshotShadowStyles(),
                    ...getScreenshotWrapperStyles(),
                  }}
                />
              </>
            ) : (
              <div
                className="relative flex h-full w-full items-center justify-center overflow-hidden"
                style={{
                  borderRadius: `${borderRadius}px`,
                }}
              >
                <div
                  data-export-ignore="true"
                  className={`relative z-10 flex w-[88%] max-w-[560px] flex-col items-center rounded-2xl border px-5 py-6 text-center text-white shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-2xl transition-all duration-200 sm:px-7 sm:py-7 ${
                    isDragActive
                      ? "scale-[1.01] border-cyan-200/80 bg-white/25"
                      : "border-white/25 bg-black/35"
                  }`}
                >
                  <span className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/40 bg-white/15 text-4xl leading-none text-white/95 shadow-inner">
                    +
                  </span>

                  <p className="text-xl font-semibold tracking-tight text-white/95">
                    {isDragActive ? "Drop image here" : "Add screenshot"}
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Drop an image, paste one, browse, or capture a website.
                  </p>

                  <form
                    className="mt-5 flex w-full flex-col gap-2 sm:flex-row"
                    onSubmit={handleWebsiteCapture}
                    onClick={(event) => event.stopPropagation()}
                  >
                    <input
                      type="text"
                      inputMode="url"
                      value={websiteUrl}
                      onChange={(event) => {
                        setWebsiteUrl(event.target.value);
                        setWebsiteCaptureError("");
                      }}
                      placeholder="https://example.com"
                      aria-label="Website URL"
                      className="h-10 min-w-0 flex-1 rounded-lg border border-white/25 bg-black/25 px-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/60 focus:ring-2 focus:ring-white/20"
                    />
                    <button
                      type="submit"
                      disabled={isCapturingWebsite}
                      className="h-10 rounded-lg border border-white/30 bg-white/15 px-4 text-sm font-semibold text-white transition hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCapturingWebsite ? "Capturing..." : "Capture"}
                    </button>
                  </form>

                  {websiteCaptureError ? (
                    <p className="mt-2 text-xs font-medium text-red-100">
                      {websiteCaptureError}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    onClick={open}
                    className="mt-4 inline-flex h-9 items-center rounded-lg border border-white/30 bg-white/10 px-4 text-sm font-medium text-white/95 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
                  >
                    Choose file
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
