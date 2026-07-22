import { useState } from "react";
import { FaultIntakeForm } from "./FaultIntakeForm";
import { SubmissionsTable } from "./SubmissionsTable";
import { addSubmission, deleteSubmission, loadSubmissions } from "./storage";
import type { FaultSubmission, ParseResult } from "./types";

function App() {
  const [result, setResult] = useState<ParseResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<FaultSubmission[]>(() => loadSubmissions());

  function handleSubmitStart() {
    setError(null);
    setResult(null);
  }

  function handleResult(data: {
    customerName: string;
    customerPhone: string;
    rawText: string;
    result: ParseResult;
  }) {
    setResult(data.result);
    setSubmissions((prev) =>
      addSubmission(prev, {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        rawText: data.rawText,
        result: data.result,
      }),
    );
  }
  
  function handleDelete(id: string) {
    setSubmissions((prev) => deleteSubmission(prev, id));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-col gap-6 px-4 py-10 lg:px-12 bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Garage Assistant
        </h1>

        <FaultIntakeForm
          onSubmitStart={handleSubmitStart}
          onResult={handleResult}
          onError={setError}
        />

        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        {result && (
          <div className="flex flex-col gap-3 rounded-md border border-gray-300 p-4 dark:border-gray-600 bg-white">
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
      </div>

      <div className="flex flex-col gap-3 px-4 py-10 lg:px-12 dark:bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Submitted queries
        </h2>
        <SubmissionsTable submissions={submissions} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default App;
