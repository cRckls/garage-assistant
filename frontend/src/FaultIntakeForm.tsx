import { Button, Progress, Textarea } from "@chakra-ui/react";
import { useRef, useState } from "react";
import type { ParseResult } from "./types";

const API_BASE_URL = "http://localhost:4000";

// Mirrors the backend's REQUEST_TIMEOUT_MS in geminiClient.ts — used only to
// pace the progress bar, not an actual timeout on this end.
const REQUEST_TIMEOUT_MS = 30_000;

interface FaultIntakeFormProps {
  onSubmitStart: () => void;
  onResult: (rawText: string, result: ParseResult) => void;
  onError: (message: string) => void;
}

export function FaultIntakeForm({ onSubmitStart, onResult, onError }: FaultIntakeFormProps) {
  const [rawText, setRawText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const progressIntervalRef = useRef<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    onSubmitStart();
    setShowProgress(true);
    setProgress(0);

    const startedAt = Date.now();
    progressIntervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(99, (elapsed / REQUEST_TIMEOUT_MS) * 100));
    }, 100);

    try {
      const res = await fetch(`${API_BASE_URL}/api/faults/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const parsed: ParseResult = await res.json();
      onResult(rawText, parsed);
    } catch {
      onError("Couldn't reach the server. Is the backend running?");
    } finally {
      if (progressIntervalRef.current !== null) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setProgress(100);
      setIsLoading(false);
      setTimeout(() => setShowProgress(false), 400);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Write your query for the garage here..."
        rows={6}
        disabled={isLoading}
      />
      <Button
        type="submit"
        alignSelf="start"
        colorPalette="blue"
        loading={isLoading}
        loadingText="Processing your request..."
        disabled={isLoading || rawText.trim().length === 0}
      >
        Send request
      </Button>
      {showProgress && (
        <Progress.Root value={progress} max={100} size="xs" colorPalette="blue">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      )}
    </form>
  );
}
