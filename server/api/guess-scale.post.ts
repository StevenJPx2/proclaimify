import { GoogleGenAI } from "@google/genai/node";
import { z } from "zod/v4";

const outputSchema = z.object({
  c: z.string().describe("The root chord"),
});

export default defineEventHandler(async (event) => {
  const { chords } = await readValidatedBody(
    event,
    z.object({ chords: z.string() }).parse,
  );

  const ai = new GoogleGenAI({});

  const output = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    config: {
      systemInstruction: `You are a function that determines the root chord from a set of chords.`,
      responseMimeType: "application/json",
      responseJsonSchema: z.toJSONSchema(outputSchema),
    },
    contents: chords,
  });

  return outputSchema.parse(JSON.parse(output.text ?? "")).c;
});
