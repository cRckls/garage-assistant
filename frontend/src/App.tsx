import { Button, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { SubmissionsTable } from "./SubmissionsTable";
import { addSubmission, loadSubmissions } from "./storage";
import type { FaultSubmission, ParseResult } from "./types";

const API_BASE_URL = "http://localhost:4000";

function App() {
  const [rawText, setRawText] = useState("");
  const [result, setResult] = useState<ParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FaultSubmission[]>(() => loadSubmissions());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

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
      setResult(parsed);
      setSubmissions((prev) =>
        addSubmission(prev, {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          rawText,
          result: parsed,
        }),
      );
    } catch {
      setError("Couldn't reach the server. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen flex-col gap-6 px-4 py-10 lg:px-12">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
        Garage Fault Intake Assistant
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Paste the customer's fault description here..."
          rows={6}
        />
        <Button
          type="submit"
          alignSelf="start"
          colorPalette="blue"
          loading={isLoading}
          loadingText="Parsing..."
          disabled={rawText.trim().length === 0}
        >
          Parse fault
        </Button>
      </form>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {result && (
        <div className="flex flex-col gap-3 rounded-md border border-gray-300 p-4 dark:border-gray-600">
          {result.status === "fallback" && (
            <p className="rounded-md bg-yellow-100 px-3 py-2 text-sm text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Automatic parsing was unavailable ({result.reason}). Please fill this note in manually.
            </p>
          )}

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Vehicle summary</h2>
            <p className="text-gray-700 dark:text-gray-300">{result.note.vehicleSummary}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Main symptoms</h2>
            <ul className="list-inside list-disc text-gray-700 dark:text-gray-300">
              {result.note.mainSymptoms.map((symptom, i) => (
                <li key={i}>{symptom}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Urgency</h2>
            <p className="text-gray-700 dark:text-gray-300">{result.note.urgency}</p>
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Follow-up questions</h2>
            <ul className="list-inside list-disc text-gray-700 dark:text-gray-300">
              {result.note.followUpQuestions.map((question, i) => (
                <li key={i}>{question}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Submitted reports
        </h2>
        <SubmissionsTable submissions={submissions} />
      </div>
    </div>
  );
}

export default App;
