# Fictional payment ticket inputs

These are synthetic payment-operations inputs for a local exercise. The
sections headed `Current situation` and `Desired situation` are protected:
preserve their wording verbatim in the draft. Values are fictional and are not
approved reconciliation policy.

## TICKET-OPS-101 — Explain a fee mismatch before reconciliation

### Current situation

At the fictional Fictional Reconciliation cutoff of 2026-09-10 12:00 Europe/Amsterdam, batch B-20260909-02 contains transaction TX-NS-1004. The internal ledger records gross 15750 minor EUR, expected fee 315 minor EUR, and expected net 15435 minor EUR. The PSP settlement SET-1004-A records fee 300 minor EUR and net 15450 minor EUR. The bank credit for the batch is 15450 minor EUR. The team can see a 15 minor EUR difference in the fee calculation, but the current ticket does not say what should be checked next. No cause has been confirmed.

### Desired situation

A reviewer can see the preserved payment situation, the calculation that explains the fee difference, a small technical proposal, positive and negative behavior checks, and OPEN questions for the evidence or owner still needed. The draft must not approve the batch or invent a cause.

## TICKET-OPS-102 — Trace a bank payout mismatch

### Current situation

At the fictional Fictional Reconciliation cutoff of 2026-09-10 12:00 Europe/Amsterdam, batch B-20260910-02 has a PSP settlement net of 3234 minor EUR and a bank credit of 3200 minor EUR. The ticket identifies the batch but does not yet include a source-row identifier or explain whether the difference is a bank trace issue, a timing issue, or a source-data issue. No cause has been confirmed and no payout approval has been recorded.

### Desired situation

A reviewer can distinguish the observed 34 minor EUR batch difference from any unverified explanation, see a bounded technical proposal, exercise positive and negative checks, and find OPEN requests for source rows, ownership, timing, and human approval. The draft must leave the payout unresolved until the evidence is rechecked.
