export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  textOnPrimary: string;
  textOnBg: string;
}

export interface SuggestedPrompt {
  title: string;
  prompt: string;
}

export interface BannerCopyItem {
  headline: string;
  description?: string;
  tagline?: string;
  cta: string;
}

export interface BannerCopyGroup {
  leaderboard_728x90: BannerCopyItem;
  medium_rectangle_300x250: BannerCopyItem;
  wide_skyscraper_160x600: BannerCopyItem;
  half_page_300x600: BannerCopyItem;
  billboard_970x250: BannerCopyItem;
  square_300x300: BannerCopyItem;
  mobile_banner_320x100: BannerCopyItem;
}

export interface CampaignData {
  colorPalette: ColorPalette;
  campaignHeadline: string;
  suggestedPrompts: SuggestedPrompt[];
  copy: BannerCopyGroup;
}

export interface AdProductParams {
  productName: string;
  productDescription: string;
  productUrl: string;
  brandTone: string;
}

export interface AdImageParams {
  prompt: string;
  model: string;
  aspectRatio: string;
  imageSize: string;
}

export type BannerSizeKey = keyof BannerCopyGroup;

export interface BannerSizeMeta {
  key: BannerSizeKey;
  name: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
}

export const BANNER_SIZES: BannerSizeMeta[] = [
  {
    key: "leaderboard_728x90",
    name: "Leaderboard",
    width: 728,
    height: 90,
    aspectRatio: "8:1",
    description: "Traditional top-of-page branding horizontal banner.",
  },
  {
    key: "medium_rectangle_300x250",
    name: "Medium Rectangle",
    width: 300,
    height: 250,
    aspectRatio: "6:5",
    description: "Highly engaging in-content square-rectangle format.",
  },
  {
    key: "wide_skyscraper_160x600",
    name: "Wide Skyscraper",
    width: 160,
    height: 600,
    aspectRatio: "1:4",
    description: "Tall side-rail vertical display layout.",
  },
  {
    key: "half_page_300x600",
    name: "Half Page",
    width: 300,
    height: 600,
    aspectRatio: "1:2",
    description: "Large format premium vertical canvas for brand storytelling.",
  },
  {
    key: "billboard_970x250",
    name: "Billboard",
    width: 970,
    height: 250,
    aspectRatio: "4:1",
    description: "Premium high-impact giant horizontal display.",
  },
  {
    key: "square_300x300",
    name: "Square",
    width: 300,
    height: 300,
    aspectRatio: "1:1",
    description: "Perfect square ideal for standard ad networks and socials.",
  },
  {
    key: "mobile_banner_320x100",
    name: "Mobile Banner",
    width: 320,
    height: 100,
    aspectRatio: "16:5",
    description: "Large mobile-optimized header or interstitial banner.",
  },
];
