# Auto test exercise

Set up plan.md

`init git`

Add gitignore file

```text
echo "node_modules/
.env
dist/
.DS_Store" > .gitignore
```

## Tech stack:
Why Vite? - Less config than webpack. Comes with standard things built in.
Faster - processes code on demand. Uses esbuild to bundle dependencies. Rollup for production builds. Fast hot reloading
Vitest - minimal setup, same syntax as Jest, faster to run. esbuild pipeline (only run tests that have been affected). Frontend and backend tests.

## Process

Wrote initial plan, refined it with Claude, made suggestions.
Asked it to build the initial structure. Checked along the way and the staged commit.
Noticed we forgot to mention tailwind in the plan so asked Claude to make that change.
Now we have a lightweight node.js mono repo

Run it by starting FE and BE

`npm run dev:backend` 
​`npm run dev:frontend`

Install gemini ai, zod for formatting output

Create schema for the fault notes

Added the API key from google to the .env file in /backend

Gemini 2.5 was an old model so we switched to 3.5

Build the endpoint for calling the agent and test it with mock data

Added tests for the endpoint. - Caught a slight type error and fixed it by splitting the type into success and fallback result types.

So we're asking the AI to "Extract a structured service note from this customer-reported vehicle fault description" and giving it a structure to work to with faultNoteResponseSchema

```text
const response = await getClient().models.generateContent({
      model: MODEL,
      contents: `Extract a structured service note from this customer-reported vehicle fault description:\n\n${rawText}`,
      config: {
        abortSignal: controller.signal,
        responseMimeType: "application/json",
        responseSchema: faultNoteResponseSchema,
      },
    });
```

Next. spin up a quick frontend UI to test more input and show the processed output onscreen.

Claude wanted to test it by running the browser and checking screenshots, but I prefer to do this part myself to save tokens and back and forth.

The test UI works. We can write the details of an issue and it will return some useful data. 

We need to optimise the presentation of this data somewhat. Maybe pull the details into a table.

## Next steps:

- Improve the UI. Add loading states, error fallbacks etc. 
Chose to use Chakra UI, as it's quick to add to the project, well supported. Large package size, but that could be optimised for a real project.

- Create an overview of all the issues coming in, in a table so they can be organised. (just use local storage) - back to plan mode, review plan and implement.

- review usefulness against the specification

## Result:

![image](https://capacities-files.s3.eu-central-1.amazonaws.com/private/321f681c-d4b7-4be7-b46c-a2dbd9b154a7/raw.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA5VTNRR6EBR56K2NK%2F20260722%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20260722T080500Z&X-Amz-Expires=43200&X-Amz-Signature=0e2e849faf09f6c290dd48a644e9c17216467696ab203d47c9f222e809a11ab0&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject)
[image - Notes](../Images/image.md)


## Review:

Is this information actually useful. Is the AI "likely cause" and "next step" accurate? Maybe leave that out and let the engineer decide based on the clear symptoms.

- removed those fields. The engineer will have a better idea of the causes.

- it would be good to showcase retrieving accurate data to be returned to the user. Maybe cost of servicing or MOT?

Improved the UI with Chakra UI.

Added loading state when submitting to block repeat submissions and indicate progress.

Handle error messages more elegantly

Added name and telephone number fields



## Further steps:

- flag clearly if they mention specific things like MOT or service

- Make the rows in the table editable so that any mistakes can be fixed.

- actions - [create booking] [follow up for details] [discard]

- optimise processing. If we were to get hundreds of requests we would need to handle those more efficiently.

