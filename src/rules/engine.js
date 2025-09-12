import dayjs from 'dayjs';
import { haversineKm, jaccard, normalizeSkills, includesCI, keywordMatch } from '../utils/text.js';

/**
 * Evaluate a simple expression language with helpers bound in scope.
 * This is intentionally minimalist and safe by only exposing pure helpers.
 */
function evalExpr(expr, ctx) {
  const helpers = {
    now: () => new Date(),
    subset: (req, userSet) => req.every(r => userSet.has(r.toLowerCase())),
    normSkills: (skills) => normalizeSkills(skills),
    includes: (arr, val) => (arr || []).includes(val),
    overlap: (a, b) => (a || []).some(x => (b || []).includes(x)),
    distance: (userGeo, jobGeo) => haversineKm(userGeo, jobGeo),
    jaccard: (a, bSet) => jaccard(new Set((a||[]).map(s=>s.toLowerCase())), bSet),
    keyword: (roles, title, desc) => keywordMatch(roles, title, desc),
    recent: (iso) => {
      if (!iso) return 0;
      const days = dayjs().diff(dayjs(iso), 'day');
      if (days <= 7) return 1;
      if (days <= 30) return 0.7;
      if (days <= 90) return 0.4;
      return 0.1;
    }
  };
  const fn = new Function('user','internship', ...Object.keys(helpers), `return (${expr});`);
  return fn(ctx.user, ctx.internship, ...Object.values(helpers));
}

function runHardRules(user, internship, rules) {
  const failures = [];
  for (const r of rules.hard_rules || []) {
    const whenOk = r.when ? !!evalExpr(r.when, { user, internship }) : true;
    if (!whenOk) continue;
    const ok = !!evalExpr(r.check, { user, internship });
    if (!ok) failures.push({ id: r.id, reason: r.fail_reason || 'Failed' });
  }
  return failures;
}

function runSoftRules(user, internship, rules) {
  let sum = 0;
  const details = {};
  for (const r of rules.soft_rules || []) {
    const val = Number(evalExpr(r.score, { user, internship })) || 0;
    const w = Number(r.weight || 1);
    sum += w * val;
    details[r.id] = Number(val.toFixed(3));
  }
  return { score: Number(sum.toFixed(3)), details };
}

function fairnessBoost(user, internship, rules) {
  const f = rules.fairness || {};
  const div = f.diversity_boost || {};
  let boost = 0;
  if (user?.constraints?.gender === 'F' && div.women) boost += div.women;
  if (user?.constraints?.disability === true && div.pwd) boost += div.pwd;
  if (user?.constraints?.income_band === 'EWS' && div.ews) boost += div.ews;
  const cap = Number(f.cap_per_session || 0.2);
  return Math.min(boost, cap);
}

function tieBreakerScore(internship, rules) {
  // Sum simple tie-breaker expressions to a single number
  let s = 0;
  for (const expr of rules.tie_breakers || []) {
    const val = Number(evalExpr(expr, { user: {}, internship })) || 0;
    s += val;
  }
  return s;
}

export function evaluateOne(user, internship, rules) {
  const fails = runHardRules(user, internship, rules);
  if (fails.length) {
    return { eligible: false, fails };
  }
  const soft = runSoftRules(user, internship, rules);
  const fair = fairnessBoost(user, internship, rules);
  const tie = tieBreakerScore(internship, rules);
  const total = Number((soft.score + fair + tie*1e-3).toFixed(3)); // tiny weight for tie-breakers
  return {
    eligible: true,
    score: total,
    explain: {
      passed_rules: (rules.hard_rules || []).map(r => r.id).filter(id => !fails.find(f=>f.id===id)),
      soft_scores: soft.details,
      fairness: fair,
      tie_breaker: tie
    }
  };
}

export function rank(user, internships, rules) {
  const out = [];
  for (const job of internships) {
    const e = evaluateOne(user, job, rules);
    if (!e.eligible) continue;
    out.push({ job, score: e.score, explain: e.explain });
  }
  out.sort((a,b) => b.score - a.score);
  return out;
}
