export const analyzeTransaction = (transaction) => {
  const suspicious = transaction.device === "new-device" && Number(transaction.amount_eur) >= 4000;
  return {
    risk: suspicious ? "high" : "low",
    reason: suspicious ? "new device and high amount" : "known pattern or low amount",
    recommendedAction: suspicious ? "human review" : "allow",
  };
};
