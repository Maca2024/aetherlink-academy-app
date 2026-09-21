# Preview output — TICKET-OPS-101

### Ticket identity

- Ticket: `TICKET-OPS-101`
- Status: `OPEN — fictional training draft`

### Current situation

At the fictional Fictional Reconciliation cutoff of 2026-09-10 12:00 Europe/Amsterdam, batch B-20260909-02 contains transaction TX-NS-1004. The internal ledger records gross 15750 minor EUR, expected fee 315 minor EUR, and expected net 15435 minor EUR. The PSP settlement SET-1004-A records fee 300 minor EUR and net 15450 minor EUR. The bank credit for the batch is 15450 minor EUR. The team can see a 15 minor EUR difference in the fee calculation, but the current ticket does not say what should be checked next. No cause has been confirmed.

### Desired situation

A reviewer can see the preserved payment situation, the calculation that explains the fee difference, a small technical proposal, positive and negative behavior checks, and OPEN questions for the evidence or owner still needed. The draft must not approve the batch or invent a cause.

### Technical proposal

Reproduce the fee and net calculation from the input, then keep the 15 minor EUR difference OPEN for human source-row review. `[source: Current situation — TX-NS-1004 / SET-1004-A]`

### Positive tests

- **Given** the input values, **When** the calculation is reproduced, **Then** expected net 15435 and PSP net 15450 are shown. `[source: Current situation — amounts]`
- **Given** the source values remain unchanged, **When** a reviewer reads the draft, **Then** the fee difference remains visible. `[source: Current situation — fee values]`

### Negative tests

- **Given** the bank credit equals the PSP net, **When** the fee check runs, **Then** it does not erase the fee difference. `[source: Current situation — bank and PSP values]`
- **Given** no cause is confirmed, **When** the draft is generated, **Then** it does not claim a cause or approval. `[source: Desired situation — no invented cause]`

### OPEN questions

- `[OPEN]` Which exact source rows should the human reviewer read back?
- `[OPEN]` Who owns the investigation and what review date applies?
