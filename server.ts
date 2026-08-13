import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini SDK with named parameters as required by the skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint 1: Generate copywriting and prompts from product description and URL
app.post("/api/generate-copy", async (req, res) => {
  try {
    const { productName, productDescription, productUrl, brandTone } = req.body;

    if (!productDescription) {
      return res.status(400).json({ error: "Product description is required." });
    }

    const systemInstruction = `You are an elite advertising copywriter and art director. 
Your task is to analyze a product name, description, and optional URL, and generate a cohesive, high-converting banner ad campaign.
You must output a highly professional and tailored copy schema and custom branding assets.
The brand tone requested is: ${brandTone || "Modern"}.

Specifically, output:
1. A matching aesthetic color palette (hex codes).
2. 3 highly detailed, professional, commercial-quality image generation prompts for Gemini image models (e.g. 'gemini-3.1-flash-image'). The prompts should describe clean, text-free commercial backgrounds or lifestyle product setups, avoiding any text, watermarks, or overlays.
3. Size-specific copywriting tailored to different standard ad dimensions (headlines, taglines/descriptions, CTA buttons) to make the ads look custom-designed.

Make sure all outputs are clean, exciting, and appropriate for high-quality display advertising. Do not return markdown wrapping or backticks in the text fields themselves.`;

    const promptText = `Product Name: ${productName || "Product"}
Product Description: ${productDescription}
Product URL: ${productUrl || "N/A"}
Brand Tone: ${brandTone || "Modern"}

Generate a complete creative concept, including suggested image prompts, color palette, and tailored banner copy for all standard sizes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colorPalette: {
              type: Type.OBJECT,
              description: "Brand color palette optimized for contrast and modern ad design",
              properties: {
                primary: { type: Type.STRING, description: "Primary brand color (hex, e.g. #0D9488)" },
                secondary: { type: Type.STRING, description: "Secondary/supporting color (hex)" },
                accent: { type: Type.STRING, description: "Vibrant call-to-action or highlight color (hex)" },
                background: { type: Type.STRING, description: "Clean background color for text containers (hex)" },
                textOnPrimary: { type: Type.STRING, description: "High-contrast text color on top of primary color (hex, e.g. #FFFFFF or #0f172a)" },
                textOnBg: { type: Type.STRING, description: "Main copy text color on top of the container background (hex)" },
              },
              required: ["primary", "secondary", "accent", "background", "textOnPrimary", "textOnBg"],
            },
            campaignHeadline: { type: Type.STRING, description: "A catchy overall campaign tagline or value prop" },
            suggestedPrompts: {
              type: Type.ARRAY,
              description: "Three distinct creative visual concepts for the background image",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Brief title of the visual concept (e.g., 'Minimalist Studio', 'Lifestyle Flatlay')" },
                  prompt: { type: Type.STRING, description: "A highly descriptive prompt for the image generator. Explicitly include 'commercial advertising photography, clean composition, minimalist, perfect copy space, text-free'." },
                },
                required: ["title", "prompt"],
              },
            },
            copy: {
              type: Type.OBJECT,
              description: "Copywriting adapted to standard banner sizes",
              properties: {
                leaderboard_728x90: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING, description: "Short, punchy horizontal headline (max 30 chars)" },
                    tagline: { type: Type.STRING, description: "Snappy supplementary offer or tagline (max 40 chars)" },
                    cta: { type: Type.STRING, description: "Call to Action text (e.g. 'Shop Now', 'Explore')" },
                  },
                  required: ["headline", "tagline", "cta"],
                },
                medium_rectangle_300x250: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING, description: "Balanced square headline (max 40 chars)" },
                    description: { type: Type.STRING, description: "Engaging brief benefit description (max 70 chars)" },
                    cta: { type: Type.STRING, description: "Call to Action text" },
                  },
                  required: ["headline", "description", "cta"],
                },
                wide_skyscraper_160x600: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING, description: "Vertically stacked punchy headline (max 35 chars)" },
                    tagline: { type: Type.STRING, description: "Very short vertical tagline or offer (max 30 chars)" },
                    cta: { type: Type.STRING, description: "Call to Action text" },
                  },
                  required: ["headline", "tagline", "cta"],
                },
                half_page_300x600: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING, description: "Premium vertical headline (max 45 chars)" },
                    description: { type: Type.STRING, description: "Detailed key benefit or offer details (max 100 chars)" },
                    tagline: { type: Type.STRING, description: "Supporting tagline or subtext (max 45 chars)" },
                    cta: { type: Type.STRING, description: "Call to Action text" },
                  },
                  required: ["headline", "description", "tagline", "cta"],
                },
                billboard_970x250: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING, description: "Wide display headline (max 50 chars)" },
                    description: { type: Type.STRING, description: "Explanatory product benefit text (max 120 chars)" },
                    tagline: { type: Type.STRING, description: "Special callout or discount banner text (max 45 chars)" },
                    cta: { type: Type.STRING, description: "Call to Action text" },
                  },
                  required: ["headline", "description", "tagline", "cta"],
                },
                square_300x300: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING, description: "Symmetrical square headline (max 40 chars)" },
                    description: { type: Type.STRING, description: "Brief selling point or value hook (max 65 chars)" },
                    cta: { type: Type.STRING, description: "Call to Action text" },
                  },
                  required: ["headline", "description", "cta"],
                },
                mobile_banner_320x100: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING, description: "Compact micro-headline (max 25 chars)" },
                    cta: { type: Type.STRING, description: "Very short CTA (max 12 chars)" },
                  },
                  required: ["headline", "cta"],
                },
              },
              required: [
                "leaderboard_728x90",
                "medium_rectangle_300x250",
                "wide_skyscraper_160x600",
                "half_page_300x600",
                "billboard_970x250",
                "square_300x300",
                "mobile_banner_320x100",
              ],
            },
          },
          required: ["colorPalette", "campaignHeadline", "suggestedPrompts", "copy"],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No copy response generated from Gemini.");
    }

    res.json(JSON.parse(textOutput));
  } catch (err: any) {
    console.error("Generate Copy Error:", err);
    res.status(500).json({ error: err.message || "An error occurred while generating copywriting." });
  }
});

// Endpoint 2: Generate background/creative image using Gemini Image generation models
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, model, aspectRatio, imageSize } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Image prompt is required." });
    }

    // Map user models to correct SDK models
    // User requested gemini-3.1-flash-image-preview and gemini-3-pro-image-preview.
    // In SDK, they correspond to 'gemini-3.1-flash-image' and 'gemini-3-pro-image'
    let targetModel = "gemini-3.1-flash-image"; // general cases default
    if (model === "gemini-3-pro-image-preview" || model === "gemini-3-pro-image") {
      targetModel = "gemini-3-pro-image";
    } else if (model === "gemini-3.1-flash-image-preview" || model === "gemini-3.1-flash-image") {
      targetModel = "gemini-3.1-flash-image";
    }

    console.log(`Generating image using model: ${targetModel} with prompt: "${prompt}", aspectRatio: ${aspectRatio || "1:1"}, size: ${imageSize || "1K"}`);

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: {
        parts: [
          {
            text: `${prompt}. Commercial banner backdrop, studio lighting, professional product styling, sharp focus, extremely high quality, clean, no overlay text, no watermarks.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || "1:1",
          imageSize: imageSize || "1K",
        },
      },
    });

    let base64Image = "";
    let statusText = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
        } else if (part.text) {
          statusText += part.text;
        }
      }
    }

    if (!base64Image) {
      throw new Error(`Failed to generate image. ${statusText || "No image data returned from model."}`);
    }

    res.json({
      imageUrl: `data:image/png;base64,${base64Image}`,
      promptUsed: prompt,
      modelUsed: targetModel,
    });
  } catch (err: any) {
    console.error("Generate Image Error:", err);
    res.status(500).json({ error: err.message || "An error occurred during image generation." });
  }
});

// Serve frontend build static files in production, use Vite dev server in development
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();
