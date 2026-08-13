import { AdProductParams } from "./types";

export interface PresetProduct extends AdProductParams {
  id: string;
  tagline: string;
}

export const PRESET_PRODUCTS: PresetProduct[] = [
  {
    id: "bamboo-mug",
    productName: "Aera Reusable Mug",
    productDescription: "An eco-friendly reusable coffee cup crafted from sustainable organic bamboo fibers. Double-walled thermal insulation keeps beverages piping hot for 6 hours or icy cold for 12. Complete with a spill-proof leaf-styled silicone lid and soft grip sleeve. Available in five gorgeous earth-toned pastel colors.",
    productUrl: "https://aera-eco.com/travel-mug",
    brandTone: "Minimalist",
    tagline: "Eco-friendly, double-walled sustainable bamboo travel cup.",
  },
  {
    id: "smart-ring",
    productName: "Nova Smart Ring",
    productDescription: "A revolutionary titanium health tracker worn elegantly on your finger. Nova monitors sleep stages, blood oxygen, body temperature, active heart rate, and steps with medical-grade accuracy. Syncs wirelessly with iOS and Android. Water-resistant up to 50m with a stunning 7-day battery life and satin gold finish.",
    productUrl: "https://nova-wearables.tech/ring",
    brandTone: "Tech",
    tagline: "Ultra-slim medical-grade titanium health and sleep tracking ring.",
  },
  {
    id: "chili-honey",
    productName: "Pico Hot Honey",
    productDescription: "The ultimate sweet-and-spicy condiment. Pure organic wildflower honey infused with hand-selected smoked ghost peppers and premium organic apple cider vinegar. Perfect for drizzling on wood-fired pizza, crispy fried chicken, warm biscuits, or roasted Brussels sprouts. Raw, unfiltered, and packed with a sweet fiery kick.",
    productUrl: "https://pico-gourmet.co/honey",
    brandTone: "Vibrant",
    tagline: "Sweet organic wildflower honey infused with smoked ghost peppers.",
  },
];
