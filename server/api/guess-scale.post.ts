import { z } from "zod/v4";
import { determineScale } from "../utils/determine-scale";

export default defineEventHandler(async (event) => {
  const state = await readValidatedBody(
    event,
    z.record(z.string(), z.array(z.string())).parse,
  );

  return determineScale(state);
});
