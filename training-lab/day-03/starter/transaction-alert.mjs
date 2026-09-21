export const alertForTransaction = (transaction) => {
  if (transaction.amountEur >= 9000) return { alert: true, reason: "amount exceeds the fictional review threshold", severity: "high" };
  return { alert: false, reason: "within the fictional review threshold", severity: "low" };
};
