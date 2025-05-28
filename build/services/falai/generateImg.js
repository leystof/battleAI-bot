"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFalApiKey = exports.generateImage = void 0;
const config_1 = require("../../utils/config");
async function generateImage(prompt) {
    try {
        const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${config_1.config.falai.apiKey}`,
            },
            body: JSON.stringify({
                prompt: prompt,
                image_size: "square_hd",
                num_images: 1,
            }),
        });
        if (!response.ok) {
            const errorText = await response.text();
            return {
                url: undefined,
                error: `fal.ai API error (${response.status}): ${errorText}`
            };
        }
        const data = await response.json();
        if (!data.images || data.images.length === 0) {
            return {
                url: undefined,
                error: "No images returned from fal.ai API"
            };
        }
        const imageUrl = data.images[0].url;
        if (!imageUrl) {
            return {
                url: undefined,
                error: "Empty image URL returned from fal.ai API"
            };
        }
        return {
            url: imageUrl,
            error: undefined
        };
    }
    catch (error) {
        console.error("Error generating image with fal.ai:", error);
        return {
            url: undefined,
            error: error
        };
    }
}
exports.generateImage = generateImage;
async function checkFalApiKey() {
    const FAL_KEY = process.env.FAL_API_KEY || "db1eaf50-24ff-4bcd-8306-a4da5fc55934:fa8fd5252a3b311bae578ec4eaf160cc";
    try {
        const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Key ${FAL_KEY}`,
            },
            body: JSON.stringify({
                prompt: "Test prompt",
                image_size: "square_hd",
                num_images: 1,
            }),
        });
        if (response.ok) {
            console.log("fal.ai API key is valid");
            return true;
        }
        else {
            console.error("fal.ai API key is invalid:", response.status, response.statusText);
            return false;
        }
    }
    catch (error) {
        console.error("Error checking fal.ai API key:", error);
        return false;
    }
}
exports.checkFalApiKey = checkFalApiKey;
