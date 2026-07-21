import { Router } from "express";
import { z } from "zod";
import { buildFallbackResult } from "../schema/fallback.js";
import { parseFaultFromText } from "../services/geminiClient.js";

const parseRequestSchema = z.object({
  rawText: z.string().trim().min(1, "rawText must not be empty"),
});

export const faultsRouter = Router();

faultsRouter.post("/parse", async (req, res) => {
  const parsedBody = parseRequestSchema.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error.flatten() });
    return;
  }

  const { rawText } = parsedBody.data;

  try {
    const note = await parseFaultFromText(rawText);
    res.json({ status: "ok", note });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    res.json(buildFallbackResult(rawText, reason));
  }
});
