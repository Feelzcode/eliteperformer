const COMMON_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "icloud.com",
  "live.com",
  "aol.com",
  "protonmail.com",
];

/** Real domains that sit one or two letters from a common one — never "correct" these. */
const LEGIT_NEIGHBOURS = new Set([
  "mail.com",
  "ymail.com",
  "gmx.com",
  "email.com",
  "me.com",
  "mac.com",
  "msn.com",
  "aim.com",
  "gmx.net",
  "live.co.uk",
  "yahoo.co.uk",
  "hotmail.co.uk",
  "outlook.co.uk",
  "proton.me",
]);

/** Endings that are almost always a slipped ".com", not a real country domain. */
const TLD_SLIPS = new Set(["c", "co", "cm", "om", "con", "cmo", "comm", "vom", "xom", "ocm", "cpm"]);

function editDistance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** yahoo.ca, hotmail.fr, outlook.de — a known provider on a real country ending. */
function isCountryVariant(domain) {
  const dot = domain.indexOf(".");
  if (dot < 1) return false;
  const name = domain.slice(0, dot);
  const tld = domain.slice(dot + 1);
  const knownName = COMMON_DOMAINS.some((d) => d.slice(0, d.indexOf(".")) === name);
  return knownName && !TLD_SLIPS.has(tld) && /^[a-z]{2}(\.[a-z]{2})?$/.test(tld);
}

/**
 * gmail.co, yahoo.con, hotmail.cm — a big provider's name on a slipped ending.
 * These domains never receive mail, so registration must not accept them.
 */
export function isUndeliverableProviderTypo(email) {
  const value = email.trim();
  const at = value.lastIndexOf("@");
  if (at < 1) return false;
  const domain = value.slice(at + 1).toLowerCase();
  const dot = domain.indexOf(".");
  if (dot < 1) return false;
  const name = domain.slice(0, dot);
  const tld = domain.slice(dot + 1);
  return COMMON_DOMAINS.some((d) => d.slice(0, d.indexOf(".")) === name) && TLD_SLIPS.has(tld);
}

/** "ekene@gmail.co" → "ekene@gmail.com"; null when the domain looks fine. */
export function suggestEmailFix(email) {
  const value = email.trim();
  const at = value.lastIndexOf("@");
  if (at < 1) return null;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1).toLowerCase();
  if (domain.length < 4 || COMMON_DOMAINS.includes(domain) || LEGIT_NEIGHBOURS.has(domain)) return null;
  if (isCountryVariant(domain)) return null;

  let best = null;
  let bestDistance = 3;
  for (const candidate of COMMON_DOMAINS) {
    const d = editDistance(domain, candidate);
    if (d < bestDistance) {
      best = candidate;
      bestDistance = d;
    }
  }
  return best ? `${local}@${best}` : null;
}
