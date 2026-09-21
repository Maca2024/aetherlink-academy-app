export type Transaction = { id: string; amountEur: number; region: string };
export type Alert = { alert: boolean; reason: string; severity: "high" | "low" };

export const alertForTransaction = (transaction: Transaction): Alert => transaction.amountEur >= 9000
  ? { alert: true, reason: "amount exceeds the fictional review threshold", severity: "high" }
  : { alert: false, reason: "within the fictional review threshold", severity: "low" };
