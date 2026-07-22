import type { FaultSubmission } from "./types";

// Pre-populates the review table with the three sample fault descriptions
// from mock_data/mock-faults.json, as if they'd already been submitted —
// gives the app something to show on first load without typing anything in.
export const seedSubmissions: FaultSubmission[] = [
  {
    id: "seed-0001",
    createdAt: "2026-07-20T09:00:00.000Z",
    rawText:
      "Hi, my 2018 Ford Fiesta is making a really loud grinding noise when I turn left, particularly at slow speeds like when parking. Also, the tire pressure warning light came on this morning. Can I drop it off Thursday?",
    result: {
      status: "ok",
      note: {
        vehicleSummary: "2018 Ford Fiesta",
        mainSymptoms: [
          "Loud grinding noise when turning left, particularly at slow speeds",
          "Tire pressure warning light illuminated",
        ],
        urgency: "Thursday (Customer's preferred drop-off day)",
        followUpQuestions: [
          "Does the grinding noise happen only when the vehicle is moving, or also when turning the steering wheel while stationary?",
          "Have you hit any curbs or potholes recently?",
          "Do any of the tires look visibly flat or low on air?",
        ],
      },
    },
  },
  {
    id: "seed-0002",
    createdAt: "2026-07-20T09:05:00.000Z",
    rawText:
      "The engine is making a weird clicking sound and losing power when going uphill. It's a silver Vauxhall Corsa. I think it might be the spark plugs but I'm not sure. Oh, and the windscreen wipers need replacing too.",
    result: {
      status: "ok",
      note: {
        vehicleSummary: "Silver Vauxhall Corsa",
        mainSymptoms: [
          "Engine clicking sound",
          "Loss of power when going uphill",
          "Windscreen wipers need replacing",
        ],
        urgency: "Not specified",
        followUpQuestions: [
          "What is the year of your Vauxhall Corsa?",
          "Is the check engine light or any other warning light illuminated on the dashboard?",
          "Does the clicking sound speed up as the engine RPM increases?",
        ],
      },
    },
  },
  {
    id: "seed-0003",
    createdAt: "2026-07-20T09:10:00.000Z",
    rawText:
      "Hi, my car (A red toyota yaris, 2016) is making a strange whirring noise when I wind down the front passenger window. It's been getting worse over the last 3 months and I'm worried it's going to get stuck. Can you take a look asap please?",
    result: {
      status: "ok",
      note: {
        vehicleSummary: "Red 2016 Toyota Yaris",
        mainSymptoms: [
          "Strange whirring noise when winding down the front passenger window",
          "Noise getting worse over the last 3 months",
          "Concern that the window will get stuck",
        ],
        urgency: "ASAP",
        followUpQuestions: [
          "Does the window move slower than normal when operating?",
          "Does the noise occur when winding the window up, or only when winding it down?",
          "Are there any clicking or grinding sounds accompanying the whirring noise?",
        ],
      },
    },
  },
];
