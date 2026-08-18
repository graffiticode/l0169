// Measurement and text-fitting utilities for ConceptWeb labels.
// Uses a module-level canvas 2D context for synchronous, efficient text width measurement.

let _ctx: CanvasRenderingContext2D | null | undefined;

function getMeasureCtx(): CanvasRenderingContext2D | null {
  if (_ctx !== undefined) return _ctx;
  if (typeof document === "undefined") {
    _ctx = null;
    return _ctx;
  }
  const canvas = document.createElement("canvas");
  _ctx = canvas.getContext("2d");
  return _ctx;
}

export const CONCEPT_WEB_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export function measureTextWidth(text: string, fontSizePx: number, weight: number | string = 400): number {
  const ctx = getMeasureCtx();
  if (!ctx) return text.length * fontSizePx * 0.55;
  ctx.font = `${weight} ${fontSizePx}px ${CONCEPT_WEB_FONT_STACK}`;
  return ctx.measureText(text).width;
}

export interface WrapResult {
  lines: string[];
  lineHeight: number;
  totalHeight: number;
  textWidth: number;
}

export function wrapText(
  text: string,
  fontSizePx: number,
  maxWidth: number,
  opts?: { weight?: number | string; lineHeightMultiplier?: number; maxLines?: number },
): WrapResult {
  const weight = opts?.weight ?? 400;
  const lineHeightMultiplier = opts?.lineHeightMultiplier ?? 1.2;
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (measureTextWidth(test, fontSizePx, weight) <= maxWidth || !current) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  if (opts?.maxLines && lines.length > opts.maxLines) {
    lines.length = opts.maxLines;
    lines[opts.maxLines - 1] = ellipsize(lines[opts.maxLines - 1], fontSizePx, maxWidth, weight);
  }

  const lineHeight = fontSizePx * lineHeightMultiplier;
  const textWidth = lines.reduce((w, l) => Math.max(w, measureTextWidth(l, fontSizePx, weight)), 0);

  return { lines, lineHeight, totalHeight: lines.length * lineHeight, textWidth };
}

function ellipsize(line: string, fontSizePx: number, maxWidth: number, weight: number | string): string {
  if (measureTextWidth(line, fontSizePx, weight) <= maxWidth) return line;
  let s = line;
  while (s.length > 1 && measureTextWidth(s + "…", fontSizePx, weight) > maxWidth) {
    s = s.slice(0, -1);
  }
  return s + "…";
}

export function fitTextToBox(
  text: string,
  maxWidth: number,
  maxHeight: number,
  opts: {
    maxFontSizePx: number;
    minFontSizePx: number;
    weight?: number | string;
    lineHeightMultiplier?: number;
    maxLines?: number;
  },
): { fontSizePx: number; wrap: WrapResult } {
  const { maxFontSizePx, minFontSizePx } = opts;
  let fontSizePx = maxFontSizePx;
  let wrap = wrapText(text, fontSizePx, maxWidth, opts);

  const steps = 6;
  while ((wrap.totalHeight > maxHeight || wrap.textWidth > maxWidth) && fontSizePx > minFontSizePx) {
    fontSizePx = Math.max(minFontSizePx, fontSizePx - (maxFontSizePx - minFontSizePx) / steps);
    wrap = wrapText(text, fontSizePx, maxWidth, opts);
  }

  if (wrap.totalHeight > maxHeight) {
    const maxLines = Math.max(1, Math.floor(maxHeight / wrap.lineHeight));
    wrap = wrapText(text, fontSizePx, maxWidth, { ...opts, maxLines });
  }

  return { fontSizePx, wrap };
}
