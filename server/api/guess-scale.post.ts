import OpenAI from "openai";
import { z } from "zod";

export default defineEventHandler(async (event) => {
  const { chords } = await readValidatedBody(
    event,
    z.object({ chords: z.string() }).parse,
  );

  const openai = new OpenAI();

  const output = await openai.chat.completions.create({
    n: 1,
    temperature: 0.2,
    max_tokens: 10,
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are a function that determines the root chord from a set of chords. The format you HAVE to output is in JSON: {"c": "<root_chord>"}.`,
      },
      { role: "user", content: chords },
    ],
  });

  return z
    .object({
      c: z.string(),
    })
    .parse(JSON.parse(output.choices[0].message.content ?? "Not done.")).c;
});
