import React from "react";
import { Sparkles, Grid, Layers, Download, CheckCircle, Flame } from "lucide-react";

interface HeaderProps {
  hasCampaign: boolean;
  hasImage: boolean;
  onDownloadAll: () => void;
  isDownloadingAll: boolean;
  onReset: () => void;
}

export default function Header({
  hasCampaign,
  hasImage,
  onDownloadAll,
  isDownloadingAll,
  onReset,
}: HeaderProps) {
  return (
    <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0 text-slate-100 font-sans">
      {/* Title block */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-teal-600/10 border border-teal-500/30 flex items-center justify-center">
          <Flame className="w-6 h-6 text-teal-400" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
            Banner Ad Campaign Generator
            <span className="text-[10px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
              v2.0 Full-Stack
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Generate, customize, and export professional responsive banner ad suites in standard marketing dimensions.
          </p>
        </div>
      </div>

      {/* Quick stats and major action */}
      <div className="flex items-center gap-3.5 self-end sm:self-auto">
        <div className="hidden md:flex items-center gap-5 text-xs text-slate-400 border-r border-slate-800 pr-5">
          <div className="flex items-center gap-1.5">
            <CheckCircle className={`w-4 h-4 ${hasCampaign ? "text-emerald-400" : "text-slate-600"}`} />
            <span>Copywriting: <strong className={hasCampaign ? "text-slate-200" : "text-slate-500"}>{hasCampaign ? "Ready" : "Empty"}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle className={`w-4 h-4 ${hasImage ? "text-emerald-400" : "text-slate-600"}`} />
            <span>AI Imagery: <strong className={hasImage ? "text-slate-200" : "text-slate-500"}>{hasImage ? "Generated" : "None"}</strong></span>
          </div>
        </div>

        {hasCampaign && (
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-3 py-2 rounded-lg border border-slate-800 text-slate-300 text-xs hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              Reset
            </button>
            <button
              onClick={onDownloadAll}
              disabled={isDownloadingAll}
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              id="btn-download-all"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloadingAll ? "Exporting..." : "Download Entire Suite (PNG)"}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
