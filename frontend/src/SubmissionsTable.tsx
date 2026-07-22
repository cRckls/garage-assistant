import { Badge, Table } from "@chakra-ui/react";
import { detectFlags } from "./flags";
import type { FaultSubmission } from "./types";

export function SubmissionsTable({ submissions }: { submissions: FaultSubmission[] }) {
  if (submissions.length === 0) return null;

  const flagColour = (flag: string) => {
    switch (flag) {
      case "mot":
        return "orange";
      case "service":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Original query</Table.ColumnHeader>
            <Table.ColumnHeader>Vehicle summary</Table.ColumnHeader>
            <Table.ColumnHeader>Main symptoms</Table.ColumnHeader>
            <Table.ColumnHeader>Urgency</Table.ColumnHeader>
            <Table.ColumnHeader>Follow-up questions</Table.ColumnHeader>
            <Table.ColumnHeader>Flags</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {submissions.map((submission) => (
            <Table.Row key={submission.id} verticalAlign="top">
              <Table.Cell>{submission.rawText}</Table.Cell>
              <Table.Cell>{submission.result.note.vehicleSummary}</Table.Cell>
              <Table.Cell>
                <ul className="list-disc pl-4">
                  {submission.result.note.mainSymptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </Table.Cell>
              <Table.Cell>{submission.result.note.urgency}</Table.Cell>
              <Table.Cell>
                <ul className="list-disc pl-4">
                  {submission.result.note.followUpQuestions.map((question, i) => (
                    <li key={i}>{question}</li>
                  ))}
                </ul>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-1">
                  {detectFlags(submission.rawText).map((flag) => (
                    <Badge key={flag} colorPalette={flagColour(flag.toLowerCase())}>
                      {flag}
                    </Badge>
                  ))}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
  );
}
