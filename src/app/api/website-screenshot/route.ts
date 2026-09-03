import {NextRequest, NextResponse} from "next/server";

const SCREENSHOT_API_URL = process.env.SCREENSHOT_API_URL ?? "https://api.microlink.io";
const SCREENSHOT_TIMEOUT_MS = 30000;

function normalizeUrl(rawUrl: string | null) {
  if (!rawUrl) {
    return null;
  }

  try {
    const normalizedUrl = new URL(rawUrl);
    if (
      normalizedUrl.protocol !== "https:" &&
      normalizedUrl.protocol !== "http:"
    ) {
      return null;
    }
    return normalizedUrl;
  } catch {
    return null;
  }
}

function getErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const errorPayload = payload as {
    error?: unknown;
    message?: unknown;
    hint?: unknown;
  };

  if (typeof errorPayload.message === "string") {
    return errorPayload.message;
  }

  if (typeof errorPayload.error === "string") {
    return errorPayload.error;
  }

  if (typeof errorPayload.hint === "string") {
    return errorPayload.hint;
  }

  return null;
}

export async function GET(request: NextRequest) {
  const targetUrl = normalizeUrl(request.nextUrl.searchParams.get("url"));

  if (!targetUrl) {
    return NextResponse.json(
      {error: "Enter a valid website URL."},
      {status: 400},
    );
  }

  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, SCREENSHOT_TIMEOUT_MS);

  try {
    const params = new URLSearchParams({
      url: targetUrl.href,
      screenshot: "true",
      meta: "false",
      "viewport.width": "1920",
      "viewport.height": "1080",
      "viewport.isMobile": "false",
      "viewport.deviceScaleFactor": "2",
      colorScheme: "light",
    });

    const response = await fetch(`${SCREENSHOT_API_URL}/?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
      signal: abortController.signal,
    });

    const payload = (await response.json().catch(() => null)) as {
      status?: unknown;
      data?: {
        screenshot?: {
          url?: unknown;
        };
      };
    } | null;

    if (
      !response.ok ||
      payload?.status !== "success" ||
      typeof payload?.data?.screenshot?.url !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            getErrorMessage(payload) ??
            "Could not capture this website. Try another URL.",
        },
        {status: response.status},
      );
    }

    const imageResponse = await fetch(payload.data.screenshot.url, {
      cache: "no-store",
      signal: abortController.signal,
    });

    if (!imageResponse.ok) {
      return NextResponse.json(
        {error: "Website capture did not return an image."},
        {status: 502},
      );
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    return new NextResponse(imageBuffer, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Website capture timed out. Try again or use another URL."
        : "Could not capture this website. Try another URL.";

    return NextResponse.json(
      {error: message},
      {status: 502},
    );
  } finally {
    clearTimeout(timeout);
  }
}
