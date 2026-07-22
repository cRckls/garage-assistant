import type { FaultSubmission } from "./types";

export function SubmissionsTable({ submissions }: { submissions: FaultSubmission[] }) {
  if (submissions.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600">
            <th className="p-2">Original query</th>
            <th className="p-2">Vehicle summary</th>
            <th className="p-2">Main symptoms</th>
            <th className="p-2">Urgency</th>
            <th className="p-2">Follow-up questions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className="border-b border-gray-200 align-top text-gray-700 dark:border-gray-700 dark:text-gray-300"
            >
              <td className="p-2">{submission.rawText}</td>
              <td className="p-2">{submission.result.note.vehicleSummary}</td>
              <td className="p-2">
                <ul className="list-disc pl-4">
                  {submission.result.note.mainSymptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </td>
              <td className="p-2">{submission.result.note.urgency}</td>
              <td className="p-2">
                <ul className="list-disc pl-4">
                  {submission.result.note.followUpQuestions.map((question, i) => (
                    <li key={i}>{question}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
