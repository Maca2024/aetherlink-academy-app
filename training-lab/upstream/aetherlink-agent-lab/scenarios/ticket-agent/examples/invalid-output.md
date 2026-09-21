# Preview output — intentionally invalid

### Ticket identity

- Ticket: `TICKET-OPS-101`

### Current situation

At the fictional Fictional Reconciliation cutoff of 2026-09-10 12:00 Europe/Amsterdam, batch B-20260909-02 contains transaction TX-NS-1004. The internal ledger records gross 15750 minor EUR, expected fee 315 minor EUR, and expected net 15435 minor EUR. The PSP settlement SET-1004-A records fee 300 minor EUR and net 15450 minor EUR. The bank credit for the batch is 15450 minor EUR. The team can see a 15 minor EUR difference in the fee calculation, but the current ticket does not say what should be checked next. The fee mismatch is confirmed.

### Desired situation

A reviewer can see the preserved payment situation, the calculation that explains the fee difference, a small technical proposal, positive and negative behavior checks, and OPEN questions for the evidence or owner still needed. The draft must not approve the batch or invent a cause.

### Technical proposal

Assume the fee mismatch is caused by the PSP configuration.

### Positive tests

- **Given** the input, **When** it is reviewed, **Then** it is accepted.

### OPEN questions

- None.
