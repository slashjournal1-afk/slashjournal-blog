import Prism from 'prismjs';

// Load standard language definitions
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-docker';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-graphql';

const languageAliases: Record<string, string> = {
  ts: 'typescript',
  tsx: 'tsx',
  js: 'javascript',
  jsx: 'jsx',
  py: 'python',
  python: 'python',
  sh: 'bash',
  shell: 'bash',
  bash: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  yaml: 'yaml',
  golang: 'go',
  go: 'go',
  rs: 'rust',
  rust: 'rust',
  sql: 'sql',
  postgres: 'sql',
  postgresql: 'sql',
  mysql: 'sql',
  sqlite: 'sql',
  json: 'json',
  jsonc: 'json',
  htm: 'markup',
  html: 'markup',
  markup: 'markup',
  xml: 'markup',
  svg: 'markup',
  css: 'css',
  md: 'markdown',
  markdown: 'markdown',
  mdx: 'markdown',
  docker: 'docker',
  dockerfile: 'docker',
  graphql: 'graphql',
  gql: 'graphql',
};

export function normalizeLanguage(lang?: string): string {
  if (!lang) return 'typescript';
  const clean = lang.toLowerCase().trim();
  return languageAliases[clean] || clean;
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Highlights a single line of code using Prism.js with safe fallback
 */
export function highlightCodeLine(line: string, language: string): string {
  const normLang = normalizeLanguage(language);
  const grammar =
    Prism.languages[normLang] ||
    Prism.languages.typescript ||
    Prism.languages.javascript ||
    Prism.languages.clike;

  if (!grammar || !line.trim()) {
    return escapeHtml(line);
  }

  try {
    return Prism.highlight(line, grammar, normLang);
  } catch {
    return escapeHtml(line);
  }
}

/**
 * Highlights entire code block
 */
export function highlightCodeBlock(code: string, language: string): string {
  const normLang = normalizeLanguage(language);
  const grammar =
    Prism.languages[normLang] ||
    Prism.languages.typescript ||
    Prism.languages.javascript ||
    Prism.languages.clike;

  if (!grammar || !code.trim()) {
    return escapeHtml(code);
  }

  try {
    return Prism.highlight(code, grammar, normLang);
  } catch {
    return escapeHtml(code);
  }
}
