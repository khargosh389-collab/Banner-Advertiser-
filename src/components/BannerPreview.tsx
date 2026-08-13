import React, { useState, useRef, useEffect } from "react";
import { Download, Edit2, Code, Copy, Check, X, Info } from "lucide-react";
import { toPng } from "html-to-image";
import { BannerSizeMeta, BannerCopyItem, ColorPalette } from "../types";

interface BannerPreviewProps {
  key?: React.Key;
  size: BannerSizeMeta;
  copyItem: BannerCopyItem;
  palette: ColorPalette;
  imageUrl: string | null;
  logoText: string;
  badgeText: string;
  fontFamily: string;
  imageScale: number;
  imageOffset: number;
  onUpdateCopy: (updated: BannerCopyItem) => void;
}

export default function BannerPreview({
  size,
  copyItem,
  palette,
  imageUrl,
  logoText,
  badgeText,
  fontFamily,
  imageScale,
  imageOffset,
  onUpdateCopy,
}: BannerPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Editing states with fallback
  const [editHeadline, setEditHeadline] = useState(copyItem?.headline || "");
  const [editDescription, setEditDescription] = useState(copyItem?.description || "");
  const [editTagline, setEditTagline] = useState(copyItem?.tagline || "");
  const [editCta, setEditCta] = useState(copyItem?.cta || "Learn More");

  // Keep state in sync when copyItem props change
  useEffect(() => {
    setEditHeadline(copyItem?.headline || "");
    setEditDescription(copyItem?.description || "");
    setEditTagline(copyItem?.tagline || "");
    setEditCta(copyItem?.cta || "Learn More");
  }, [copyItem]);

  const bannerRef = useRef<HTMLDivElement>(null);

  // Font class selection
  const getFontClass = () => {
    switch (fontFamily) {
      case "display":
        return "font-display";
      case "serif":
        return "font-serif";
      case "mono":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  const handleSaveEdit = () => {
    onUpdateCopy({
      headline: editHeadline,
      description: editDescription || undefined,
      tagline: editTagline || undefined,
      cta: editCta,
    });
    setIsEditing(false);
  };

  const handleDownload = async () => {
    if (!bannerRef.current) return;
    setIsDownloading(true);
    try {
      // Small timeout to allow state/styles to settle
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      let dataUrl = "";
      try {
        dataUrl = await toPng(bannerRef.current, {
          quality: 1.0,
          pixelRatio: 2, // High resolution double-scaling!
          skipFonts: false,
        });
      } catch (fontErr) {
        console.warn("Retrying PNG export without fonts due to cross-origin iframe stylesheet limitations:", fontErr);
        dataUrl = await toPng(bannerRef.current, {
          quality: 1.0,
          pixelRatio: 2,
          skipFonts: true,
        });
      }

      const link = document.createElement("a");
      link.download = `banner_${size.key}_${size.width}x${size.height}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const generateEmbedCode = () => {
    // Generate styled mock HTML with absolute variables inlined
    return `<!-- Banner Ad Campaign: ${size.name} (${size.width}x${size.height}) -->
<div 
  id="ad-banner-${size.key}"
  style="
    width: ${size.width}px;
    height: ${size.height}px;
    background-color: ${palette.background};
    color: ${palette.textOnBg};
    font-family: system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    border: 1px solid rgba(0,0,0,0.1);
  "
>
  ${
    imageUrl
      ? `<div style="
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: url('${imageUrl.substring(0, 100)}...');
          background-size: cover;
          background-position: center;
          opacity: 0.8;
          z-index: 1;
        "></div>`
      : ""
  }
  <!-- Content overlay here -->
</div>`;
  };

  const handleCopyCode = async () => {
    try {
      const embedCode = generateEmbedCode();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(embedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback copy mechanism for iframe environment without clipboard write permission
        const textarea = document.createElement("textarea");
        textarea.value = embedCode;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  // Helper styles for positions
  const fontClass = getFontClass();

  // Background style configuration
  const bgImageStyle: React.CSSProperties = imageUrl
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${imageScale}%`,
        backgroundPosition: `center ${50 + imageOffset}%`,
        backgroundRepeat: "no-repeat",
      }
    : {
        backgroundColor: palette.secondary,
        backgroundSize: "cover",
      };

  return (
    <div className="flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-700">
      {/* Banner Card Header Controls */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div>
          <span className="text-xs font-bold text-slate-100 block flex items-center gap-1.5">
            {size.name}
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-normal">
              {size.width} x {size.height}
            </span>
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">
            Ratio {size.aspectRatio} • {size.description}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Edit Copy Button */}
          <button
            onClick={() => {
              setEditHeadline(copyItem.headline);
              setEditDescription(copyItem.description || "");
              setEditTagline(copyItem.tagline || "");
              setEditCta(copyItem.cta);
              setIsEditing(!isEditing);
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Edit Copywriting"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          {/* Embed Code Button */}
          <button
            onClick={() => setShowCode(!showCode)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title="Export HTML / CSS"
          >
            <Code className="w-3.5 h-3.5" />
          </button>

          {/* Download PNG Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-2.5 py-1.5 rounded-lg bg-teal-600 text-slate-950 font-semibold text-xs hover:bg-teal-500 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Download high-resolution banner ad"
          >
            <Download className="w-3 h-3" />
            {isDownloading ? "Saving..." : "PNG"}
          </button>
        </div>
      </div>

      {/* Code Modal Overlay */}
      {showCode && (
        <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs text-slate-300 animate-fadeIn space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold flex items-center gap-1 text-teal-400">
              <Info className="w-3 h-3" /> Export Snippet Info
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300"
              >
                {copied ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" /> Copy Code
                  </>
                )}
              </button>
              <button onClick={() => setShowCode(false)} className="text-slate-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-slate-400">
            Copy this HTML scaffold with your exact dynamic styling, CTA, and visual sizes.
          </p>
          <pre className="bg-slate-950 p-2 rounded text-[10px] font-mono overflow-x-auto text-emerald-400 border border-slate-800 max-h-36">
            {generateEmbedCode()}
          </pre>
        </div>
      )}

      {/* Inline Quick Editor */}
      {isEditing && (
        <div className="p-4 bg-slate-900 border-b border-slate-800 space-y-3 text-xs animate-fadeIn">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-teal-400">Tweak Ad Size Copywriting</span>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">Size-specific Headline</label>
              <input
                type="text"
                value={editHeadline}
                onChange={(e) => setEditHeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            {copyItem.description !== undefined && (
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Description Text</label>
                <textarea
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>
            )}

            {copyItem.tagline !== undefined && (
              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Supplementary Tagline</label>
                <input
                  type="text"
                  value={editTagline}
                  onChange={(e) => setEditTagline(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] text-slate-400 mb-0.5">CTA Button Text</label>
              <input
                type="text"
                value={editCta}
                onChange={(e) => setEditCta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded text-[11px]"
              >
                Save Tweaks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Wrapper and Scaling Container */}
      <div className="flex-1 bg-slate-900 p-6 flex items-center justify-center overflow-auto min-h-[160px]">
        {/* Ad Render Target Node */}
        <div
          ref={bannerRef}
          id={`banner-node-${size.key}`}
          style={{
            width: `${size.width}px`,
            height: `${size.height}px`,
            backgroundColor: palette.background,
            color: palette.textOnBg,
            position: "relative",
          }}
          className={`flex-shrink-0 select-none overflow-hidden border border-black/10 shadow-lg ${fontClass}`}
        >
          {/* Background Image Container */}
          {imageUrl && (
            <div
              style={bgImageStyle}
              className="absolute inset-0 z-0 transition-all duration-300"
            />
          )}

          {/* LAYOUT TEMPLATE 1: LEADERBOARD (728 x 90) */}
          {size.key === "leaderboard_728x90" && (
            <div className="absolute inset-0 z-10 flex items-center justify-between px-6 py-2 bg-gradient-to-r from-black/85 via-black/50 to-transparent">
              {/* Logo & Headline */}
              <div className="flex flex-col justify-center max-w-[420px]">
                {logoText && (
                  <span
                    style={{ color: palette.accent }}
                    className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1.5"
                  >
                    {logoText}
                  </span>
                )}
                <h2
                  style={{ color: "#FFFFFF" }}
                  className="text-[15px] font-extrabold tracking-tight leading-snug truncate"
                >
                  {copyItem.headline}
                </h2>
                {copyItem.tagline && (
                  <span style={{ color: "#D1D5DB" }} className="text-[10px] opacity-90 font-medium truncate mt-0.5">
                    {copyItem.tagline}
                  </span>
                )}
              </div>

              {/* Special offer badge & CTA */}
              <div className="flex items-center gap-4">
                {badgeText && (
                  <div
                    style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                    className="px-2.5 py-1 text-[9px] font-extrabold rounded-full shadow-sm animate-pulse"
                  >
                    {badgeText}
                  </div>
                )}
                <button
                  style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  className="px-4 py-2 text-[11px] font-extrabold uppercase rounded shadow-md transform hover:scale-105 transition-all"
                  type="button"
                >
                  {copyItem.cta}
                </button>
              </div>
            </div>
          )}

          {/* LAYOUT TEMPLATE 2: MEDIUM RECTANGLE (300 x 250) */}
          {size.key === "medium_rectangle_300x250" && (
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-4 bg-gradient-to-t from-black/90 via-black/40 to-black/10">
              {/* Top Row: Logo & Badge */}
              <div className="flex justify-between items-start">
                <span
                  style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                  className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm"
                >
                  {logoText || "AD"}
                </span>
                {badgeText && (
                  <span
                    style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                    className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm"
                  >
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Bottom Section: Text block & CTA */}
              <div className="space-y-2 text-center sm:text-left">
                <h2
                  style={{ color: "#FFFFFF" }}
                  className="text-[15px] font-extrabold leading-tight tracking-tight line-clamp-2"
                >
                  {copyItem.headline}
                </h2>
                {copyItem.description && (
                  <p style={{ color: "#E5E7EB" }} className="text-[10px] leading-relaxed line-clamp-2 opacity-90">
                    {copyItem.description}
                  </p>
                )}
                <div className="pt-1">
                  <button
                    style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                    className="w-full py-1.5 text-[10px] font-extrabold uppercase rounded shadow-md"
                    type="button"
                  >
                    {copyItem.cta}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT TEMPLATE 3: WIDE SKYSCRAPER (160 x 600) */}
          {size.key === "wide_skyscraper_160x600" && (
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-3.5 text-center bg-gradient-to-b from-black/95 via-black/40 to-black/95">
              {/* Top block */}
              <div className="space-y-3 pt-2">
                <span
                  style={{ color: palette.accent }}
                  className="text-[11px] font-extrabold uppercase tracking-wider block"
                >
                  {logoText || "BRAND"}
                </span>
                {badgeText && (
                  <div
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                    className="text-[8px] font-extrabold py-0.5 px-1.5 rounded inline-block shadow"
                  >
                    {badgeText}
                  </div>
                )}
              </div>

              {/* Middle core copy */}
              <div className="my-auto space-y-4 px-1">
                <h2
                  style={{ color: "#FFFFFF" }}
                  className="text-[15px] font-extrabold leading-tight tracking-tight uppercase"
                >
                  {copyItem.headline}
                </h2>
                <div style={{ backgroundColor: palette.accent }} className="w-8 h-0.5 mx-auto opacity-70"></div>
                {copyItem.tagline && (
                  <p style={{ color: "#D1D5DB" }} className="text-[10px] leading-relaxed italic opacity-85">
                    {copyItem.tagline}
                  </p>
                )}
              </div>

              {/* Bottom CTA Button */}
              <div className="pb-3 px-1">
                <button
                  style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                  className="w-full py-2.5 text-[11px] font-extrabold uppercase rounded shadow-lg transform active:scale-95 transition-all"
                  type="button"
                >
                  {copyItem.cta}
                </button>
              </div>
            </div>
          )}

          {/* LAYOUT TEMPLATE 4: HALF PAGE (300 x 600) */}
          {size.key === "half_page_300x600" && (
            <div className="absolute inset-0 z-10 flex flex-col justify-between bg-gradient-to-t from-black/95 via-black/60 to-black/30 p-6">
              {/* Top brand header */}
              <div className="flex justify-between items-center">
                <span
                  style={{ color: palette.accent }}
                  className="text-xs font-black uppercase tracking-widest"
                >
                  {logoText || "SPONSORED"}
                </span>
                {badgeText && (
                  <span
                    style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                    className="text-[9px] font-black uppercase px-2.5 py-1 rounded"
                  >
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Large copy layout */}
              <div className="space-y-4 pb-2">
                <div style={{ backgroundColor: palette.accent }} className="w-12 h-1 rounded"></div>
                <h2
                  style={{ color: "#FFFFFF" }}
                  className="text-[22px] font-black leading-tight tracking-tight uppercase"
                >
                  {copyItem.headline}
                </h2>
                {copyItem.description && (
                  <p style={{ color: "#E5E7EB" }} className="text-xs leading-relaxed opacity-95">
                    {copyItem.description}
                  </p>
                )}
                {copyItem.tagline && (
                  <p style={{ color: palette.accent }} className="text-xs font-semibold">
                    {copyItem.tagline}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                    className="w-full py-3 text-xs font-black uppercase tracking-wider rounded shadow-md transform hover:translate-y-[-2px] transition-all"
                    type="button"
                  >
                    {copyItem.cta}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT TEMPLATE 5: BILLBOARD (970 x 250) */}
          {size.key === "billboard_970x250" && (
            <div className="absolute inset-0 z-10 flex p-6 bg-gradient-to-r from-black/95 via-black/70 to-transparent">
              <div className="flex-1 flex flex-col justify-between max-w-[550px]">
                {/* Brand Logo & Tag */}
                <div className="flex items-center gap-3">
                  <span
                    style={{ color: palette.accent }}
                    className="text-xs font-black uppercase tracking-wider"
                  >
                    {logoText || "RECOMMENDED"}
                  </span>
                  {badgeText && (
                    <span
                      style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                      className="text-[9px] font-extrabold px-2 py-0.5 rounded"
                    >
                      {badgeText}
                    </span>
                  )}
                </div>

                {/* Typography and copy */}
                <div className="my-auto space-y-2">
                  <h2 style={{ color: "#FFFFFF" }} className="text-xl font-black tracking-tight leading-tight">
                    {copyItem.headline}
                  </h2>
                  {copyItem.description && (
                    <p style={{ color: "#D1D5DB" }} className="text-xs leading-relaxed line-clamp-2 opacity-90">
                      {copyItem.description}
                    </p>
                  )}
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-4">
                  <button
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                    className="px-6 py-2.5 text-xs font-bold uppercase rounded shadow-md hover:brightness-110"
                    type="button"
                  >
                    {copyItem.cta}
                  </button>
                  {copyItem.tagline && (
                    <span style={{ color: "#E5E7EB" }} className="text-xs font-semibold italic opacity-80">
                      {copyItem.tagline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT TEMPLATE 6: SQUARE (300 x 300) */}
          {size.key === "square_300x300" && (
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-5 bg-gradient-to-t from-black/90 via-black/50 to-black/10">
              {/* Header */}
              <div className="flex justify-between items-center">
                <span
                  style={{ color: palette.accent }}
                  className="text-[10px] font-black tracking-wider uppercase"
                >
                  {logoText || "DISCOVER"}
                </span>
                {badgeText && (
                  <span
                    style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                    className="text-[8px] font-extrabold py-0.5 px-2 rounded"
                  >
                    {badgeText}
                  </span>
                )}
              </div>

              {/* Text content & CTA button */}
              <div className="space-y-2 text-center sm:text-left">
                <h2 style={{ color: "#FFFFFF" }} className="text-base font-black leading-tight line-clamp-2">
                  {copyItem.headline}
                </h2>
                {copyItem.description && (
                  <p style={{ color: "#D1D5DB" }} className="text-[10px] leading-relaxed line-clamp-2 opacity-85">
                    {copyItem.description}
                  </p>
                )}
                <div className="pt-2">
                  <button
                    style={{ backgroundColor: palette.primary, color: palette.textOnPrimary }}
                    className="w-full py-2 text-xs font-black uppercase rounded shadow"
                    type="button"
                  >
                    {copyItem.cta}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LAYOUT TEMPLATE 7: MOBILE BANNER (320 x 100) */}
          {size.key === "mobile_banner_320x100" && (
            <div className="absolute inset-0 z-10 flex items-center justify-between p-3 bg-gradient-to-r from-black/95 via-black/60 to-transparent">
              {/* Copy on left */}
              <div className="flex flex-col justify-center max-w-[190px]">
                {logoText && (
                  <span
                    style={{ color: palette.accent }}
                    className="text-[8px] font-extrabold uppercase tracking-widest leading-none mb-1"
                  >
                    {logoText}
                  </span>
                )}
                <h2
                  style={{ color: "#FFFFFF" }}
                  className="text-xs font-black tracking-tight leading-snug truncate"
                >
                  {copyItem.headline}
                </h2>
                {badgeText && (
                  <span style={{ color: palette.accent }} className="text-[9px] font-semibold mt-0.5">
                    ★ {badgeText}
                  </span>
                )}
              </div>

              {/* Button on right */}
              <button
                style={{ backgroundColor: palette.accent, color: palette.textOnPrimary }}
                className="px-3 py-1.5 text-[9px] font-black uppercase rounded shadow"
                type="button"
              >
                {copyItem.cta}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
