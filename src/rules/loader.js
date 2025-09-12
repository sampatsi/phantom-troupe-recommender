import fs from 'fs';
import yaml from 'js-yaml';

export function loadRules(filePath) {
  const doc = yaml.load(fs.readFileSync(filePath, 'utf-8'));
  // Defaults
  doc.fairness = doc.fairness || {};
  return doc;
}
