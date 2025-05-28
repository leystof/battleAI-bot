import {AI} from "@/services/openai/index";
import {log} from "@/utils/logger";

export async function generateImagePrompt(): Promise<string> {
    try {
        const { text } = await AI.aiGenerateText({
            model: AI.client("gpt-4o"),
            prompt: `You are a creative AI assistant specialized in generating unique, detailed, and visually rich prompts for image generation. Keep the prompts concise but descriptive, around 170 characters.

For each request, create a completely different prompt with varied themes, styles, and subjects. Consider these expanded categories:

THEMES (choose one or combine creatively):
- Fantasy worlds (magical forests, floating islands, crystal caves, enchanted ruins, mythical kingdoms)
- Sci-fi environments (futuristic cities, alien worlds, space stations, cyberpunk streets, post-apocalyptic landscapes)
- Historical periods (ancient Egypt, medieval Europe, Renaissance Italy, Victorian London, 1920s America, ancient China)
- Surreal scenes (dreamlike settings, impossible architecture, abstract concepts visualized, optical illusions)
- Nature scenes (dramatic landscapes, underwater worlds, weather phenomena, microworlds, geological formations)
- Urban settings (cyberpunk cities, ancient towns, bustling marketplaces, abandoned places, futuristic metropolises)
- Cultural settings (Japanese gardens, Moroccan markets, Nordic villages, Indian temples, African savannas)
- Character-focused scenes (mythical creatures, robots, interesting people, anthropomorphic animals)

ARTISTIC STYLES (choose one):
- Realistic photography
- Oil painting
- Watercolor
- Digital art
- Pixel art
- Anime/Manga
- Abstract
- Impressionist
- Surrealist
- Minimalist
- Baroque
- Art Nouveau
- Ukiyo-e
- Cubist
- Gothic
- Pop Art

VISUAL ELEMENTS (include at least 2):
- Interesting lighting (golden hour, neon lights, bioluminescence, dramatic shadows, moonlight)
- Weather conditions (fog, rain, snow, storm, clear skies, aurora)
- Time of day (dawn, midday, dusk, midnight)
- Color schemes (monochromatic, complementary colors, pastel, vibrant, muted)
- Perspective (aerial view, macro, wide angle, first person, isometric)
- Mood (peaceful, tense, joyful, mysterious, melancholic, energetic)

IMPORTANT GUIDELINES:
- Vary the time of day, weather, color palettes, and moods between prompts
- Include specific visual details that would make for an interesting guessing game
- NEVER exceed 170 characters
- Write in English only
- Do NOT include words like "prompt" or "image" in your response
- Provide ONLY the prompt text without quotation marks or additional commentary
- Create something COMPLETELY DIFFERENT from the recent prompts

Generate a completely unique prompt now:`,
            temperature: 1.1,
            maxTokens: 100,
            presencePenalty: 0.8,
            frequencyPenalty: 0.8,
        })

        let finalPrompt = text.trim()
        if (finalPrompt.length > 170) {
            finalPrompt = finalPrompt.substring(0, 167) + "..."
        }

        return finalPrompt
    } catch (error) {
        log.error("Error generating image prompt: ", error)
        return "A majestic mountain landscape at sunset with a crystal clear lake reflecting the orange sky, surrounded by pine trees"
    }
}
