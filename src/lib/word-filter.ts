// U4: Reserved display names and content filters

export const RESERVED_NAMES = [
  'admin',
  'administrator',
  'slashjournal',
  'slashblog',
  'moderator',
  'mod',
  'owner',
  'system',
  'staff',
  'root',
  'official',
  'editor',
  'support',
  'help',
  'redaksi',
  'penulis',
  'pengelola',
];

export function isDisplayNameAllowed(name: string): { valid: boolean; reason?: string } {
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return { valid: false, reason: 'Nama tampilan minimal 2 karakter.' };
  }
  if (trimmed.length > 40) {
    return { valid: false, reason: 'Nama tampilan maksimal 40 karakter.' };
  }

  const lower = trimmed.toLowerCase();
  for (const reserved of RESERVED_NAMES) {
    if (lower === reserved || lower.includes(`@${reserved}`) || lower.startsWith(`${reserved} `)) {
      return { valid: false, reason: `Nama "${name}" dicadangkan untuk sistem redaksi.` };
    }
  }

  return { valid: true };
}

export function sanitizeComment(content: string): { valid: boolean; content: string; reason?: string } {
  const trimmed = content.trim();
  if (trimmed.length < 3) {
    return { valid: false, content: '', reason: 'Komentar terlalu pendek (minimal 3 karakter).' };
  }
  if (trimmed.length > 2000) {
    return { valid: false, content: '', reason: 'Komentar melebihi batas 2.000 karakter.' };
  }

  // Detect spam links abuse (> 3 links)
  const linkMatches = trimmed.match(/https?:\/\//gi);
  if (linkMatches && linkMatches.length > 3) {
    return { valid: false, content: '', reason: 'Komentar terdeteksi mengandung terlalu banyak tautan eksternal.' };
  }

  return { valid: true, content: trimmed };
}
