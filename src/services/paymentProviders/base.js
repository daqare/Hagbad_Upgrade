export const STAGES = [
  { key: 'connect', label: 'Connecting to provider' },
  { key: 'request', label: 'Sending approval request' },
  { key: 'wait', label: 'Waiting for confirmation' },
  { key: 'verify', label: 'Verifying transaction' },
  { key: 'ledger', label: 'Creating ledger record' },
  { key: 'receipt', label: 'Generating receipt' },
];

export function createProviderAdapter({ id, name, short, region, accent, ussdHint }) {
  return {
    id, name, short, region, accent, ussdHint,
    demo: true,
    async authorize({ amount, phone, onStage, shouldFail = false }) {
      for (let i = 0; i < STAGES.length; i++) {
        onStage?.(i);
        await new Promise((r) => setTimeout(r, 550 + Math.random() * 500));
        if (shouldFail && i === 2) {
          const err = new Error('Provider declined the request. Please try again.');
          err.stage = i;
          throw err;
        }
      }
      return { ok: true, provider: id, amount, phone };
    },
  };
}
