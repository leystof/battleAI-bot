import {generateText as aiGenerateText} from "ai"
import { openai as aiOpenai } from "@ai-sdk/openai"

export const AI = {
    client: aiOpenai,
    aiGenerateText,
}
