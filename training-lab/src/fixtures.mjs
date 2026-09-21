export const ports = Object.freeze({
  weather: 48135,
  jira: 48136,
  gitlab: 48137,
  confluence: 48138,
});

export const weatherFixtures = Object.freeze({
  "Amsterdam|2026-09-21": { city: "Amsterdam", date: "2026-09-21", temperatureC: 17, condition: "light rain", precipitationProbability: 70 },
  "Brussels|2026-09-21": { city: "Brussels", date: "2026-09-21", temperatureC: 18, condition: "cloudy", precipitationProbability: 35 },
  "Lisbon|2026-09-21": { city: "Lisbon", date: "2026-09-21", temperatureC: 24, condition: "sunny", precipitationProbability: 5 },
});

const jiraIssues = Object.freeze([
  { key: "TRAIN-101", summary: "Reconcile sample settlement", description: "Compare the fictional ledger and PSP export.", status: "Open", assignee: "Ari Example", labels: ["training", "read-only"] },
  { key: "TRAIN-102", summary: "Document retry policy", description: "Record the retry boundary for the fictional workflow.", status: "In Progress", assignee: "Bo Example", labels: ["training", "read-only"] },
]);

const gitlabMergeRequests = Object.freeze([
  { iid: 7, title: "Handle settlement rounding", description: "Review the boundary case in the fictional settlement calculator.", state: "opened", author: "Casey Example", sourceBranch: "training/rounding", labels: ["training", "read-only"] },
  { iid: 8, title: "Add runbook headings", description: "Review the headings in the fictional runbook.", state: "merged", author: "Dana Example", sourceBranch: "training/runbook", labels: ["training", "read-only"] },
]);

const confluencePages = Object.freeze([
  { id: "PAGE-201", title: "Settlement review guide", body: "Use the ledger, PSP export, and reviewer checklist from the training fixture.", space: "TRAIN" },
]);

export const fixtureCatalog = Object.freeze({
  jira: {
    name: "training-jira",
    version: "0.1.0",
    tools: {
      list_issues: {
        description: "List fictional Jira issues for the training workspace.",
        inputSchema: { type: "object", properties: { status: { type: "string" } } },
        run: (input) => {
          const status = String(input.status ?? "").trim().toLowerCase();
          return { issues: status ? jiraIssues.filter((issue) => issue.status.toLowerCase() === status) : jiraIssues };
        },
      },
      get_issue: {
        description: "Read one fictional Jira issue by key.",
        inputSchema: { type: "object", properties: { key: { type: "string" } }, required: ["key"] },
        run: (input) => jiraIssues.find((issue) => issue.key === input.key) ?? { error: "Issue not found in fictional fixture", key: input.key },
      },
    },
  },
  gitlab: {
    name: "training-gitlab",
    version: "0.1.0",
    tools: {
      list_merge_requests: {
        description: "List fictional GitLab merge requests for the training workspace.",
        inputSchema: { type: "object", properties: { state: { type: "string" } } },
        run: (input) => {
          const state = String(input.state ?? "").trim().toLowerCase();
          return { mergeRequests: state ? gitlabMergeRequests.filter((mergeRequest) => mergeRequest.state === state) : gitlabMergeRequests };
        },
      },
      get_merge_request: {
        description: "Read one fictional GitLab merge request by IID.",
        inputSchema: { type: "object", properties: { iid: { type: "number" } }, required: ["iid"] },
        run: (input) => gitlabMergeRequests.find((mergeRequest) => mergeRequest.iid === input.iid) ?? { error: "Merge request not found in fictional fixture", iid: input.iid },
      },
    },
  },
  confluence: {
    name: "training-confluence",
    version: "0.1.0",
    tools: {
      search_pages: {
        description: "Search fictional Confluence pages for the training workspace.",
        inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
        run: (input) => {
          const query = String(input.query ?? "").trim().toLowerCase();
          return { pages: query ? confluencePages.filter((page) => [page.title, page.body, page.space].some((field) => field.toLowerCase().includes(query))) : confluencePages };
        },
      },
      get_page: {
        description: "Read one fictional Confluence page by ID.",
        inputSchema: { type: "object", properties: { id: { type: "string" } }, required: ["id"] },
        run: (input) => confluencePages.find((page) => page.id === input.id) ?? { error: "Page not found in fictional fixture", id: input.id },
      },
    },
  },
});
