# Ticket-agent output template and checklist

Use this file as the output contract. Copy the two protected sections from the
chosen input exactly, then append the four sections below. Keep the functional
description separate from the technical proposal. Mark unsupported details
`OPEN` instead of turning assumptions into payment facts.

### Ticket identity

- Ticket: `TICKET-OPS-___`
- Title: `___`
- Status: `OPEN — fictional training draft`

### Current situation

`COPY THE CHOSEN INPUT SECTION VERBATIM.`

### Desired situation

`COPY THE CHOSEN INPUT SECTION VERBATIM.`

### Technical proposal

Describe a small, reviewable implementation or investigation approach. Name
the relevant source fields or calculations. Do not claim that a system,
credential, endpoint, or remote ticket exists.

### Positive tests

Write at least two behavior checks in Given / When / Then form. Use only facts
supported by the input or label an unresolved detail `OPEN`.

### Negative tests

Write at least two boundary or failure checks in Given / When / Then form.
Include the risk of treating an unresolved payment discrepancy as approved.

### OPEN questions

List missing evidence, owner or due-date decisions, and assumptions that need
human confirmation. Keep this section even when the draft feels complete.

### Human preview checklist

- [ ] Protected sections are unchanged and still readable.
- [ ] Technical proposal is separate from the functional situation.
- [ ] Positive and negative tests are recognizable as Given / When / Then.
- [ ] Unsupported details are marked `OPEN`.
- [ ] A human preview happened before any local copy or write.
- [ ] No remote write, credential, or production claim was made.
