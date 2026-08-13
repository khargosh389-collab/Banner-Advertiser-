import React, { useState } from "react";
import { Sparkles, Link, Type as FontIcon, Image as ImageIcon, Sliders, Check, RefreshCw, Palette, HelpCircle } from "lucide-react";
import { AdProductParams, AdImageParams, CampaignData, SuggestedPrompt } from "../types";
import { PRESET_PRODUCTS } from "../data";

interface SidebarInputsProps {
  productParams: AdProductParams;
  setProductParams: React.Dispatch<React.SetStateAction<AdProductParams>>;
  imageParams: AdImageParams;
  setImageParams: React.Dispatch<React.SetStateAction<AdImageParams>>;
  campaignData: CampaignData | null;
  setCampaignData: (data: CampaignData | null) => void;
  generatedImage: string | null;
  onGenerateCopy: () => Promise<void>;
  onGenerateImage: () => Promise<void>;
  isGeneratingCopy: boolean;
  isGeneratingImage: boolean;
  globalLogoText: string;
  setGlobalLogoText: (text: string) => void;
  globalBadgeText: string;
  setGlobalBadgeText: (text: string) => void;
  globalFontFamily: string;
  setGlobalFontFamily: (font: string) => void;
  imageScale: number;
  setImageScale: (scale: number) => void;
  imageOffset: number;
  setImageOffset: (offset: number) => void;
  customPalette: CampaignData["colorPalette"] | null;
  setCustomPalette: React.Dispatch<React.SetStateAction<CampaignData["colorPalette"] | null>>;
  onTriggerPaidModelFlow: () => void;
}

const BRAND_TONES = [
  { value: "Minimalist", label: "Minimalist", desc: "Clean spacing, soft colors, editorial elegance" },
  { value: "Tech", label: "Sleek & Cyber Tech", desc: "Monochrome & high-tech accents, bold fonts" },
  { value: "Vibrant", label: "Vibrant & Playful", desc: "Bright palettes, high-contrast, friendly shapes" },
  { value: "Elegant", label: "Luxury & Elegant", desc: "Rich serif fonts, dark background, gold highlights" },
  { value: "Bold", label: "Bold & High-Impact", desc: "Heavy block fonts, neon details, energetic copy" },
];

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1 Square", desc: "Socials & Square ads" },
  { value: "16:9", label: "16:9 Wide", desc: "Landscape & Billboard ads" },
  { value: "9:16", label: "9:16 Vertical", desc: "Mobile full-screen & Skyscraper ads" },
  { value: "4:3", label: "4:3 Classic", desc: "Standard card thumbnail layouts" },
  { value: "3:4", label: "3:4 Portrait", desc: "Standard portrait cards" },
  { value: "3:2", label: "3:2 Photo", desc: "Classic landscape ratio" },
  { value: "2:3", label: "2:3 Poster", desc: "Vertical marketing banners" },
  { value: "21:9", label: "21:9 Ultra-Wide", desc: "Panoramic billboards" },
];

export default function SidebarInputs({
  productParams,
  setProductParams,
  imageParams,
  setImageParams,
  campaignData,
  setCampaignData,
  generatedImage,
  onGenerateCopy,
  onGenerateImage,
  isGeneratingCopy,
  isGeneratingImage,
  globalLogoText,
  setGlobalLogoText,
  globalBadgeText,
  setGlobalBadgeText,
  globalFontFamily,
  setGlobalFontFamily,
  imageScale,
  setImageScale,
  imageOffset,
  setImageOffset,
  customPalette,
  setCustomPalette,
  onTriggerPaidModelFlow,
}: SidebarInputsProps) {
  const [activeTab, setActiveTab] = useState<"product" | "creative" | "branding">("product");

  const loadPreset = (presetId: string) => {
    const preset = PRESET_PRODUCTS.find((p) => p.id === presetId);
    if (preset) {
      setProductParams({
        productName: preset.productName,
        productDescription: preset.productDescription,
        productUrl: preset.productUrl,
        brandTone: preset.brandTone,
      });
    }
  };

  const handlePaletteChange = (key: keyof CampaignData["colorPalette"], value: string) => {
    if (campaignData) {
      const basePalette = customPalette || campaignData.colorPalette;
      const updated = { ...basePalette, [key]: value };
      setCustomPalette(updated);
    }
  };

  // If a paid model is selected, let's trigger the AI studio paid flow check
  const handleModelChange = (modelName: string) => {
    setImageParams((prev) => ({ ...prev, model: modelName }));
    if (modelName === "gemini-3-pro-image-preview") {
      onTriggerPaidModelFlow();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100 font-sans">
      {/* Sidebar Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950 p-1">
        <button
          onClick={() => setActiveTab("product")}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "product"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          id="tab-product"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Product Info
        </button>
        <button
          onClick={() => setActiveTab("creative")}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "creative"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          id="tab-creative"
          disabled={!campaignData}
          title={!campaignData ? "Please generate copywriting campaign first" : ""}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Creative Media
          {!campaignData && (
            <span className="text-[10px] bg-slate-800 px-1 py-0.2 rounded text-slate-500">Lock</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("branding")}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "branding"
              ? "bg-teal-600 text-white shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
          }`}
          id="tab-branding"
          disabled={!campaignData}
          title={!campaignData ? "Please generate copywriting campaign first" : ""}
        >
          <Palette className="w-3.5 h-3.5" />
          Styling
          {!campaignData && (
            <span className="text-[10px] bg-slate-800 px-1 py-0.2 rounded text-slate-500">Lock</span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* TAB 1: PRODUCT INFO INPUT */}
        {activeTab === "product" && (
          <div className="space-y-4 animate-fadeIn">
            {/* Presets Row */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                Quick Start Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_PRODUCTS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loadPreset(p.id)}
                    className="p-2 text-left bg-slate-950 hover:bg-teal-950 hover:border-teal-800 border border-slate-800 rounded-lg transition-all group"
                    type="button"
                  >
                    <div className="text-[11px] font-bold text-slate-200 group-hover:text-teal-300 truncate">
                      {p.productName}
                    </div>
                    <div className="text-[9px] text-slate-400 line-clamp-2 leading-tight mt-0.5">
                      {p.tagline}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aera Reusable Mug"
                  value={productParams.productName}
                  onChange={(e) => setProductParams({ ...productParams, productName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Product Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-slate-300">Product Description</label>
                  <span className="text-[10px] text-slate-400">Be detailed for best copy</span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describe your product benefits, features, materials, and who it's for..."
                  value={productParams.productDescription}
                  onChange={(e) => setProductParams({ ...productParams, productDescription: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 transition-colors resize-none leading-relaxed"
                />
              </div>

              {/* Product URL */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300 flex items-center gap-1">
                  <Link className="w-3 h-3 text-slate-400" />
                  Product URL <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  placeholder="e.g. https://aera-eco.com/mug"
                  value={productParams.productUrl}
                  onChange={(e) => setProductParams({ ...productParams, productUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>

              {/* Brand Tone Selector */}
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Brand Tone / Aesthetic</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto border border-slate-800 rounded-lg p-1.5 bg-slate-950">
                  {BRAND_TONES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setProductParams({ ...productParams, brandTone: t.value })}
                      className={`w-full text-left p-2 rounded-md transition-all flex items-center justify-between ${
                        productParams.brandTone === t.value
                          ? "bg-teal-900/40 text-teal-300 border border-teal-800/60"
                          : "text-slate-300 hover:bg-slate-900 border border-transparent"
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold block">{t.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">{t.desc}</span>
                      </div>
                      {productParams.brandTone === t.value && <Check className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Generation */}
              <button
                type="button"
                onClick={onGenerateCopy}
                disabled={isGeneratingCopy || !productParams.productDescription.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-sm rounded-lg shadow-md hover:shadow-teal-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                id="btn-generate-campaign"
              >
                {isGeneratingCopy ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    Generating Ad Campaign Copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                    Generate Campaign Copy
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CREATIVE MEDIA GENERATOR */}
        {activeTab === "creative" && campaignData && (
          <div className="space-y-4 animate-fadeIn">
            {/* Curated Suggested Prompts */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-teal-400 mb-2">
                Curated AI Concept Prompts
              </label>
              <div className="space-y-2">
                {campaignData.suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageParams((prev) => ({ ...prev, prompt: p.prompt }))}
                    className={`w-full p-2.5 text-left rounded-lg border transition-all text-xs ${
                      imageParams.prompt === p.prompt
                        ? "bg-teal-950/40 border-teal-500 text-teal-200"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                    }`}
                    type="button"
                  >
                    <div className="font-bold flex items-center justify-between">
                      <span>Concept {idx + 1}: {p.title}</span>
                      {imageParams.prompt === p.prompt && (
                        <span className="text-[9px] bg-teal-500 text-slate-950 px-1 rounded">Active</span>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] text-slate-400 line-clamp-3 leading-relaxed">
                      {p.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Image Prompt Textarea */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-300">Customize Image Prompt</label>
              <textarea
                rows={3}
                placeholder="Modify or describe exactly the visual background setup you want..."
                value={imageParams.prompt}
                onChange={(e) => setImageParams({ ...imageParams, prompt: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-teal-500 transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Model & Quality Settings */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">AI Model</label>
                <select
                  value={imageParams.model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="gemini-3.1-flash-image-preview">Standard (Flash)</option>
                  <option value="gemini-3-pro-image-preview">Studio (Pro ⭐)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-300">Resolution / Size</label>
                <select
                  value={imageParams.imageSize}
                  onChange={(e) => setImageParams({ ...imageParams, imageSize: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                >
                  <option value="1K">1K High Quality</option>
                  <option value="2K">2K Super Resolution</option>
                  <option value="4K">4K Ultra Studio Quality</option>
                </select>
              </div>
            </div>

            {/* Image Aspect Ratio Chips */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">Creative Aspect Ratio</label>
                <span className="text-[10px] text-slate-400">Fits specific layouts</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 border border-slate-800 rounded-lg p-2 bg-slate-950">
                {ASPECT_RATIOS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setImageParams({ ...imageParams, aspectRatio: r.value })}
                    className={`p-1 rounded text-center transition-all ${
                      imageParams.aspectRatio === r.value
                        ? "bg-teal-600 text-white font-semibold text-[11px]"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-[10px]"
                    }`}
                    title={r.desc}
                  >
                    <div className="font-bold">{r.value}</div>
                    <div className="text-[8px] text-slate-400 hidden sm:block truncate">{r.label.split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Fine Tuning (Scale & Position Offset) */}
            {generatedImage && (
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400">
                  <Sliders className="w-3.5 h-3.5" />
                  Visual Fitting & Positioning
                </div>

                {/* Scale Slider */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>Background Image Scale</span>
                    <span>{imageScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="200"
                    step="5"
                    value={imageScale}
                    onChange={(e) => setImageScale(Number(e.target.value))}
                    className="w-full accent-teal-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Vertical Offset Slider */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-300 mb-0.5">
                    <span>Vertical Position Focus</span>
                    <span>{imageOffset}%</span>
                  </div>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    step="5"
                    value={imageOffset}
                    onChange={(e) => setImageOffset(Number(e.target.value))}
                    className="w-full accent-teal-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Generate Visual Button */}
            <button
              type="button"
              onClick={onGenerateImage}
              disabled={isGeneratingImage || !imageParams.prompt}
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="btn-generate-image"
            >
              {isGeneratingImage ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  Generating AI Image Asset...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-slate-950 fill-current" />
                  {generatedImage ? "Regenerate Image Asset" : "Generate Image Asset"}
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 3: BRANDING & CUSTOM COLOR STYLING */}
        {activeTab === "branding" && campaignData && (
          <div className="space-y-4 animate-fadeIn">
            {/* Global Content Overrides */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-teal-400">
                Global Banner Overlays
              </label>

              {/* Logo text override */}
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Logo / Brand Name</label>
                <input
                  type="text"
                  value={globalLogoText}
                  onChange={(e) => setGlobalLogoText(e.target.value)}
                  placeholder="e.g. AERA"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Special badge text override */}
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Highlight Badge / Offer Text</label>
                <input
                  type="text"
                  value={globalBadgeText}
                  onChange={(e) => setGlobalBadgeText(e.target.value)}
                  placeholder="e.g. 20% OFF or NEW ARRIVAL"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Font Family selector */}
              <div>
                <label className="block text-[11px] text-slate-300 mb-0.5">Ad Typography Family</label>
                <select
                  value={globalFontFamily}
                  onChange={(e) => setGlobalFontFamily(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="sans">Clean Neo-Sans (Inter)</option>
                  <option value="display">Tech Space-Grotesk (Modern)</option>
                  <option value="serif">Luxurious Editorial (Playfair)</option>
                  <option value="mono">Geek Brutalist (JetBrains Mono)</option>
                </select>
              </div>
            </div>

            {/* Custom Brand Colors */}
            <div className="border-t border-slate-800 pt-3 space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold uppercase tracking-wider text-teal-400">
                  Custom Brand Colors
                </label>
                <button
                  type="button"
                  onClick={() => setCustomPalette(campaignData.colorPalette)}
                  className="text-[10px] text-slate-400 hover:text-teal-400 flex items-center gap-0.5"
                >
                  <RefreshCw className="w-2.5 h-2.5" /> Reset Colors
                </button>
              </div>

              {/* Grid of Color Pickers */}
              <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950 rounded-lg border border-slate-800">
                {Object.entries(customPalette || campaignData.colorPalette).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-[9px] capitalize text-slate-400 block mb-1">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-7 h-7 rounded border border-slate-700 overflow-hidden flex-shrink-0 cursor-pointer">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handlePaletteChange(key as keyof CampaignData["colorPalette"], e.target.value)}
                          className="absolute -top-1 -left-1 w-10 h-10 border-0 p-0 cursor-pointer"
                        />
                      </div>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handlePaletteChange(key as keyof CampaignData["colorPalette"], e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-[10px] text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Powered by footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 text-center flex items-center justify-center gap-1 text-[10px] text-slate-500">
        <span>Powered by Gemini 3.5 & Image Models</span>
      </div>
    </div>
  );
}
