import React, { useState } from "react";
import { Sparkles, Image as ImageIcon, Flame, Grid, Layers, AlertCircle, RefreshCw } from "lucide-react";
import { AdProductParams, AdImageParams, CampaignData, BannerSizeMeta, BANNER_SIZES, BannerCopyItem } from "./types";
import Header from "./components/Header";
import SidebarInputs from "./components/SidebarInputs";
import BannerPreview from "./components/BannerPreview";

export default function App() {
  // Core state declarations
  const [productParams, setProductParams] = useState<AdProductParams>({
    productName: "",
    productDescription: "",
    productUrl: "",
    brandTone: "Minimalist",
  });

  const [imageParams, setImageParams] = useState<AdImageParams>({
    prompt: "",
    model: "gemini-3.1-flash-image-preview",
    aspectRatio: "1:1",
    imageSize: "1K",
  });

  const [campaignData, setCampaignData] = useState<CampaignData | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Styling and branding overrides
  const [globalLogoText, setGlobalLogoText] = useState("");
  const [globalBadgeText, setGlobalBadgeText] = useState("SPECIAL OFFER");
  const [globalFontFamily, setGlobalFontFamily] = useState("sans");

  // Visual positioning fine-tuners
  const [imageScale, setImageScale] = useState(100);
  const [imageOffset, setImageOffset] = useState(0);

  // Custom Palette overrides
  const [customPalette, setCustomPalette] = useState<CampaignData["colorPalette"] | null>(null);

  // System states
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Callbacks
  const handleGenerateCopy = async () => {
    setIsGeneratingCopy(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productParams),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate campaign copywriting.");
      }

      const data: CampaignData = await response.json();
      setCampaignData(data);
      setCustomPalette(data.colorPalette);

      // Default the image prompt and logo text based on returned campaign
      setGlobalLogoText(productParams.productName.toUpperCase() || "BRAND");
      setGlobalBadgeText("SPECIAL OFFER");
      
      if (data.suggestedPrompts && data.suggestedPrompts.length > 0) {
        setImageParams((prev) => ({
          ...prev,
          prompt: data.suggestedPrompts[0].prompt,
        }));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred while connecting to the campaign generator.");
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: imageParams.prompt,
          model: imageParams.model,
          aspectRatio: imageParams.aspectRatio,
          imageSize: imageParams.imageSize,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate visual assets.");
      }

      const data = await response.json();
      setGeneratedImage(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "An error occurred during Image generation.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Triggers downloading each of the sizes sequentially
  const handleDownloadAll = async () => {
    setIsDownloadingAll(true);
    try {
      for (const size of BANNER_SIZES) {
        const btn = document.querySelector(
          `#banner-node-${size.key}`
        )?.parentElement?.parentElement?.querySelector("button[title='Download high-resolution banner ad']") as HTMLButtonElement;
        if (btn) {
          btn.click();
          // Sequential delay to prevent browser blockage or rate limits
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    } catch (err) {
      console.error("Batch download failed:", err);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleUpdateCopyItem = (sizeKey: string, updatedItem: BannerCopyItem) => {
    if (campaignData) {
      setCampaignData({
        ...campaignData,
        copy: {
          ...campaignData.copy,
          [sizeKey]: updatedItem,
        },
      });
    }
  };

  const handleReset = () => {
    setCampaignData(null);
    setGeneratedImage(null);
    setProductParams({
      productName: "",
      productDescription: "",
      productUrl: "",
      brandTone: "Minimalist",
    });
    setCustomPalette(null);
    setErrorMessage(null);
  };

  const handleTriggerPaidModelFlow = () => {
    // This serves as an illustrative call / hook for AI Studio's paid tier mechanism
    console.log("Triggering show_aistudio_ui for paid_model_flow");
  };

  const activePalette = customPalette || (campaignData ? campaignData.colorPalette : null);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <Header
        hasCampaign={!!campaignData}
        hasImage={!!generatedImage}
        onDownloadAll={handleDownloadAll}
        isDownloadingAll={isDownloadingAll}
        onReset={handleReset}
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Inputs and Controls */}
        <div className="w-full md:w-[380px] flex-shrink-0 border-b md:border-b-0 border-slate-800 md:h-full">
          <SidebarInputs
            productParams={productParams}
            setProductParams={setProductParams}
            imageParams={imageParams}
            setImageParams={setImageParams}
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            generatedImage={generatedImage}
            onGenerateCopy={handleGenerateCopy}
            onGenerateImage={handleGenerateImage}
            isGeneratingCopy={isGeneratingCopy}
            isGeneratingImage={isGeneratingImage}
            globalLogoText={globalLogoText}
            setGlobalLogoText={setGlobalLogoText}
            globalBadgeText={globalBadgeText}
            setGlobalBadgeText={setGlobalBadgeText}
            globalFontFamily={globalFontFamily}
            setGlobalFontFamily={setGlobalFontFamily}
            imageScale={imageScale}
            setImageScale={setImageScale}
            imageOffset={imageOffset}
            setImageOffset={setImageOffset}
            customPalette={customPalette}
            setCustomPalette={setCustomPalette}
            onTriggerPaidModelFlow={handleTriggerPaidModelFlow}
          />
        </div>

        {/* Right Side: Main Preview Workspace */}
        <div className="flex-1 overflow-y-auto bg-slate-900 p-6">
          {/* Error Message Notice */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-800/60 rounded-xl flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-200 block text-sm">Generation Encountered an Error</span>
                <p className="text-xs text-red-300 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* EMPTY STATE / LANDING BRIEF */}
          {!campaignData ? (
            <div className="max-w-4xl mx-auto my-12 text-center space-y-8 animate-fadeIn">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-teal-600/10 border border-teal-500/20 flex items-center justify-center mx-auto text-teal-400 shadow-md">
                  <Grid className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Design Beautiful Display Ads Instantly
                </h2>
                <p className="text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
                  Enter your product description or load a preset, choose a brand aesthetic tone, and generate a fully styled 7-size display campaign complete with AI backgrounds and custom copywriting.
                </p>
              </div>

              {/* Graphical representation of standard sizes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-2xl mx-auto">
                <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-xl text-center space-y-2">
                  <div className="w-full h-12 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500 font-mono">
                    728 x 90
                  </div>
                  <span className="text-xs font-bold block text-slate-300">Leaderboard</span>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-xl text-center space-y-2">
                  <div className="w-16 h-12 bg-slate-900 border border-slate-800 rounded mx-auto flex items-center justify-center text-[10px] text-slate-500 font-mono">
                    300 x 250
                  </div>
                  <span className="text-xs font-bold block text-slate-300">Rectangle</span>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-xl text-center space-y-2">
                  <div className="w-8 h-16 bg-slate-900 border border-slate-800 rounded mx-auto flex items-center justify-center text-[10px] text-slate-500 font-mono">
                    160 x 600
                  </div>
                  <span className="text-xs font-bold block text-slate-300">Skyscraper</span>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800/60 rounded-xl text-center space-y-2">
                  <div className="w-full h-14 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500 font-mono">
                    970 x 250
                  </div>
                  <span className="text-xs font-bold block text-slate-300">Billboard</span>
                </div>
              </div>

              {/* Steps overview */}
              <div className="border-t border-slate-800/60 pt-8 max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="space-y-1.5">
                  <span className="text-teal-400 font-black text-sm">Step 1</span>
                  <h4 className="text-sm font-bold text-slate-200">Submit Details</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Provide a product description and url, then choose a brand tone matching your audience.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-teal-400 font-black text-sm">Step 2</span>
                  <h4 className="text-sm font-bold text-slate-200">Copy & Palette</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Gemini creates tailored copywriting, brand assets, and generates optimized background prompts.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-teal-400 font-black text-sm">Step 3</span>
                  <h4 className="text-sm font-bold text-slate-200">Generate & Tweak</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Instantly render all 7 banners with your AI visual backdrop. Tweak sizes and download them instantly!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* ACTIVE CAMPAIGN WORKSPACE */
            <div className="space-y-6">
              {/* Campaign Status Info Bar */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-sm animate-fadeIn">
                <div>
                  <span className="text-xs font-bold text-teal-400 block uppercase tracking-wider">
                    Active Suite
                  </span>
                  <h3 className="text-base font-black text-white mt-0.5">
                    "{campaignData.campaignHeadline || productParams.productName}"
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">
                    Tone: <strong className="text-slate-300">{productParams.brandTone}</strong> • Style: <strong className="text-slate-300">Custom Brand Palette</strong>
                  </p>
                </div>

                {!generatedImage && (
                  <div className="bg-amber-950/30 border border-amber-900/50 px-4 py-3 rounded-lg flex items-center gap-2 max-w-sm">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                    <p className="text-[11px] text-amber-300 leading-relaxed">
                      Copy is ready! Head over to the <strong className="text-white">Creative Media</strong> tab in the sidebar to generate your AI background image.
                    </p>
                  </div>
                )}
              </div>

              {/* BANNER WORKSPACE GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fadeIn">
                {campaignData && BANNER_SIZES.map((size) => {
                  const copyItem = campaignData.copy?.[size.key] || {
                    headline: campaignData.campaignHeadline || "Special Offer",
                    description: productParams.productDescription || "Limited time offer",
                    tagline: "Don't miss out",
                    cta: "Shop Now",
                  };
                  const currentPalette = activePalette || campaignData.colorPalette;
                  return (
                    <BannerPreview
                      key={size.key}
                      size={size}
                      copyItem={copyItem}
                      palette={currentPalette}
                      imageUrl={generatedImage}
                      logoText={globalLogoText}
                      badgeText={globalBadgeText}
                      fontFamily={globalFontFamily}
                      imageScale={imageScale}
                      imageOffset={imageOffset}
                      onUpdateCopy={(updatedItem) => handleUpdateCopyItem(size.key, updatedItem)}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
