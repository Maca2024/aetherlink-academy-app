# Worked target examples — shape only

These two examples show the level and structure a learner might reach after
adding the source-evidence instruction. They are fictional discussion aids,
not approved gold-standard tickets and not evidence that a reconciliation ran.
Do not put this file in the agent prompt or copy it into `.claude/agents/`.

## TICKET-OPS-101 — Worked target A

### Ticket identity

- Ticket: `TICKET-OPS-101`
- Title: Explain a fee mismatch before reconciliation
- Status: `OPEN — fictional training draft`

### Current situation

At the fictional Fictional Reconciliation cutoff of 2026-09-10 12:00 Europe/Amsterdam, batch B-20260909-02 contains transaction TX-NS-1004. The internal ledger records gross 15750 minor EUR, expected fee 315 minor EUR, and expected net 15435 minor EUR. The PSP settlement SET-1004-A records fee 300 minor EUR and net 15450 minor EUR. The bank credit for the batch is 15450 minor EUR. The team can see a 15 minor EUR difference in the fee calculation, but the current ticket does not say what should be checked next. No cause has been confirmed.

### Desired situation

A reviewer can see the preserved payment situation, the calculation that explains the fee difference, a small technical proposal, positive and negative behavior checks, and OPEN questions for the evidence or owner still needed. The draft must not approve the batch or invent a cause.

### Technical proposal

1. Reproduce the ledger calculation from the `Current situation`: 15750 gross minus 315 expected fee equals 15435 expected net; compare it with the PSP's 300 fee and 15450 net. `[source: Current situation — TX-NS-1004 / SET-1004-A]`
2. Present the 15 minor EUR fee difference as an unresolved investigation item and keep approval outside this draft. `[source: Desired situation — no approval or invented cause]`
3. Request a human readback of the source rows before any reconciliation status changes. `[source: OPEN — source-row location is not supplied]`

### Positive tests

- **Given** the values in the input, **When** the fee and net are recalculated, **Then** the draft shows expected fee 315, expected net 15435, PSP fee 300, PSP net 15450, and difference 15. `[source: Current situation — amounts]`
- **Given** the source values are unchanged, **When** a reviewer reads the ticket, **Then** the fee mismatch remains visible and the batch is not approved. `[source: Desired situation — no approval]`

### Negative tests

- **Given** the bank credit equals the PSP net, **When** the fee check runs, **Then** it does not erase the 15 minor EUR fee difference. `[source: Current situation — bank and PSP values]`
- **Given** no cause is confirmed, **When** the draft is generated, **Then** it does not state a root cause or mark the payout reconciled. `[source: Current situation — no cause; Desired situation — no invented cause]`

### OPEN questions

- `[OPEN]` Which ledger and PSP source rows should a reviewer read back, and where is the approved training copy?
- `[OPEN]` Who owns the fee investigation and what review date should be recorded?
- `[OPEN]` Is 2% round-half-up the applicable fictional rule for this exercise, or must the trainer confirm it before use?

## TICKET-OPS-102 — Worked target B

### Ticket identity

- Ticket: `TICKET-OPS-102`
- Title: Trace a bank payout mismatch
- Status: `OPEN — fictional training draft`

### Current situation

At the fictional Fictional Reconciliation cutoff of 2026-09-10 12:00 Europe/Amsterdam, batch B-20260910-02 has a PSP settlement net of 3234 minor EUR and a bank credit of 3200 minor EUR. The ticket identifies the batch but does not yet include a source-row identifier or explain whether the difference is a bank trace issue, a timing issue, or a source-data issue. No cause has been confirmed and no payout approval has been recorded.

### Desired situation

A reviewer can distinguish the observed 34 minor EUR batch difference from any unverified explanation, see a bounded technical proposal, exercise positive and negative checks, and find OPEN requests for source rows, ownership, timing, and human approval. The draft must leave the payout unresolved until the evidence is rechecked.

### Technical proposal

1. Compare the PSP net 3234 with the bank credit 3200 for batch B-20260910-02 and show the 34 minor EUR difference as a batch-level discrepancy. `[source: Current situation — batch and amounts]`
2. Keep the status `OPEN` and request source-row readback before suggesting whether the issue is timing, bank trace, or source data. `[source: Current situation — no source row or confirmed cause]`
3. Record a human owner and review date only after they are supplied. `[source: OPEN — owner and timing are not supplied]`

### Positive tests

- **Given** the two values in the input, **When** the batch comparison runs, **Then** it reports PSP net 3234, bank credit 3200, and a 34 minor EUR difference. `[source: Current situation — batch and amounts]`
- **Given** source rows are later provided and agree with the displayed values, **When** a reviewer rechecks them, **Then** the difference remains visible and the case stays OPEN pending a human decision. `[source: Desired situation — recheck before approval]`

### Negative tests

- **Given** the PSP value is larger than the bank credit, **When** a draft is produced, **Then** it does not silently round away or reverse the 34 minor EUR difference. `[source: Current situation — amounts]`
- **Given** the cause is unconfirmed, **When** the ticket is reviewed, **Then** it does not label the difference as timing, bank error, or source-data error. `[source: Current situation — no cause]`

### OPEN questions

- `[OPEN]` What are the exact PSP settlement and bank-credit source-row identifiers?
- `[OPEN]` Who owns the bank trace, and what cutoff or review date applies?
- `[OPEN]` What human approval is required before any payout status can change?
