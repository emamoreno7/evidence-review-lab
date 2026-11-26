const encoder = new TextEncoder();
const modes = new Set(['off', 'review', 'auto']);
const maxBytes = 16_384;

export async function sha256(text) {
  const bytes = encoder.encode(text);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

// A registry entry describes a demo fixture, not an attestation of a real event.
// The caller cannot change the registry by editing a claim or its evidence.
export function createEvaluator(registry) {
  const sources = new Map();
  for (const entry of registry) {
    if (!entry.id || sources.has(entry.id) ||
        !['document', 'http'].includes(entry.domain) ||
        !/^[a-f0-9]{64}$/.test(entry.digest) ||
        !Number.isSafeInteger(entry.bytes) || entry.bytes < 1 || entry.bytes > maxBytes) {
      throw new TypeError('Invalid fixture registry');
    }
    sources.set(entry.id, Object.freeze({ ...entry }));
  }
  return async function evaluate(input) {
    const { sourceId, evidence, claim, mode } = input ?? {};
    const source = sources.get(sourceId);
    const result = { sourceId: typeof sourceId === 'string' ? sourceId : null,
      domain: source?.domain ?? 'unknown', integrity: 'NOT_CHECKED',
      support: 'NOT_CHECKED', authenticity: source?.domain === 'http' ? 'UNVERIFIED' : 'NOT_APPLICABLE',
      decision: 'BLOCK', reason: '', expectedDigest: source?.digest ?? null, observedDigest: null };
    const finish = reason => Object.freeze({ ...result, reason });
    if (!modes.has(mode) || !source || typeof evidence !== 'string' || typeof claim !== 'string' ||
        !claim.trim() || claim.includes('\n') || claim.includes('\r') ||
        encoder.encode(evidence).length > maxBytes || encoder.encode(claim).length > maxBytes) {
      return finish('INVALID_INPUT');
    }
    if (mode === 'off') { result.decision = 'HOLD'; return finish('AUTOMATION_OFF'); }
    try { result.observedDigest = await sha256(evidence); }
    catch { return finish('INTEGRITY_CHECK_FAILED'); }
    if (result.observedDigest !== source.digest || encoder.encode(evidence).length !== source.bytes) {
      result.integrity = 'MISMATCH'; return finish('EVIDENCE_CHANGED');
    }
    result.integrity = 'MATCH';
    // Exact complete-line matching only. A substring or paraphrase is not proof.
    result.support = evidence.split(/\r?\n/).includes(claim) ? 'EXACT_LINE' : 'NO_EXACT_LINE';
    if (result.support !== 'EXACT_LINE') { result.decision = 'HOLD'; return finish('CLAIM_NOT_EXTRACTIVE'); }
    if (source.domain === 'http') { result.decision = 'HOLD'; return finish('CAPTURE_NOT_AUTHENTICATED'); }
    if (mode === 'review') { result.decision = 'HOLD'; return finish('HUMAN_REVIEW_REQUIRED'); }
    result.decision = 'ELIGIBLE';
    return finish('LOCAL_POLICY_SATISFIED');
  };
}
