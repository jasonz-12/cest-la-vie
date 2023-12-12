# C'est La Vie Project - MVP

## Description
This project includes the minimal viable product (MVP) for a simple version that is able to:
1. Using an OpenAPI spec JSON file `./api-specs/openapi-spec.json` in the GPTs backend action, the GPT (**Notion Diary Creator**) connects to and performs POST operations to the middle API endpoint application, hosted on Google Cloud Platform's Cloud Run (GCR) service (app link: `https://mvp-q5yqkjuiza-uc.a.run.app`).
2. User will be prompted and provide very basic descriptions of what they wanted to write about today - and the GPT will help turn that into a Notion entry.
3. Upon confirmation, the GPT will then send the data over to the GCR endpoint, which makes a POST operation to the Notion API endpoint.

## Files
* `./app_structure.txt`: defines the overall structure of this repository, including `.js` scripts and `.json` files to be referenced/used.
* `./app.js`: main application file, handling the port number, data transformation for the data coming from GPT into a format that fits the Notion API, incoming data uses the path `/receive-gpt-data`.
* `./utils/notionDataParser.js`: defines the function that takes the `dataFromGPT` value and fills in the Notion POST request data template in `./utils/template.json` and returns the value `dataForNotion`.
* `./utils/notionApi.js`: pass the Notion API-compatible data to the Notion API endpoint (`https://api.notion.com/v1/pages/`) to create a page. Note that here the environment variable `NOTION_API_KEY` needs to be specified for this to work.
* `./routes/post.js`: handles the request and response for the Notion API interaction, it gets the `parsedData` from `app.js` and sends it to the Notion endpoint and returns the response (either code `200` or code `500`) to GPT.
