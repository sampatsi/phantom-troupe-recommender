// Text/geo helpers for the rule engine

const skillAliases = {
  "ms excel": ["excel", "spreadsheets"],
  "javascript": ["js"],
  "c++": ["cpp", "c plus plus"],
  "python": ["py"]
};

export function normalizeSkills(skills=[]) {
  const set = new Set((skills||[]).map(s => (s||'').toString().trim().toLowerCase()));
  // infer canonical names from aliases
  for (const [canon, alts] of Object.entries(skillAliases)) {
    if (alts.some(a => set.has(a))) set.add(canon);
  }
  return set;
}

export function jaccard(aSet, bSet){
  let inter = 0;
  for (const v of aSet) if (bSet.has(v)) inter++;
  const union = aSet.size + bSet.size - inter;
  return union === 0 ? 0 : inter/union;
}

export function includesCI(arr=[], val=''){
  return (arr||[]).some(x => (x||'').toString().toLowerCase() === (val||'').toString().toLowerCase());
}

export function keywordMatch(roles=[], title='', desc=''){
  const hay = `${title||''} ${desc||''}`.toLowerCase();
  const any = (roles||[]).some(r => hay.includes((r||'').toLowerCase()));
  return any ? 1 : 0;
}

// Haversine distance in km; expects {type:'Point',coordinates:[lon,lat]}
export function haversineKm(userGeo, jobGeo){
  if (!userGeo?.coordinates || !jobGeo?.coordinates) return Number.POSITIVE_INFINITY;
  const [lon1, lat1] = userGeo.coordinates;
  const [lon2, lat2] = jobGeo.coordinates;
  const R = 6371;
  const toRad = d => d*Math.PI/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}
