import { rank } from '../rules/engine.js';

export function recommend({ user, internships, rules, limit=10 }){
  // Pre-filter: deadline not passed and verified true
  const pool = internships.filter(j => {
    const deadlineOk = !j.application_deadline || new Date(j.application_deadline) >= new Date();
    return deadlineOk && (j.verified !== false);
  }).slice(0, 1000);

  const ranked = rank(user, pool, rules);
  const result = ranked.slice(0, limit).map(x => ({
    internshipId: x.job._id,
    title: x.job.title,
    org: x.job.org,
    location: x.job.is_remote ? `${x.job.location} / Remote` : x.job.location,
    stipend: x.job.stipend,
    duration_months: x.job.duration_months,
    score: x.score,
    why: x.explain
  }));
  return { count: result.length, items: result };
}
