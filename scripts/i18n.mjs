// Checks the translations in src/locales against the English text on the site.
//
//   npm run i18n                     what each language is missing, and English text not yet sent through t()
//   npm run i18n -- --catalog x.json every English text with where it appears, for translators
//
// English text is found in three places: the first argument of t(), rich() and
// plural() calls; every string in src/content/ that isn't an id, address or
// other setting; and text fields (label, title, body…) of the UPPER_CASE
// tables at the top of components.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SRC = path.join(ROOT, 'src');
const LOCALES = path.join(SRC, 'locales');

// The officers' review desk stays in English.
const ENGLISH_ONLY = new Set(['pages/WallReview.tsx']);
// Settings, not text, wherever they appear in src/content/.
const SETTINGS = new Set([
  'id', 'ids', 'url', 'path', 'src', 'position', 'shape', 'slug', 'kind', 'tone', 'field', 'style', 'href', 'signupUrl',
  'linkedin', 'photo', 'date', 'chatDate', 'email', 'instagram', 'joinForm',
]);
// Text fields of the tables at the top of components.
const TEXT_FIELDS = new Set(['label', 'title', 'body', 'action', 'alt', 'sentence']);
// Words that stay as they are in every language.
const BRAND = /^[\s:·]*(NHISA|Newhouse)?[\s:·]*$/;

const messages = new Map(); // English text → { one?, where: Set }
const untranslated = []; // English shown without t()

function add(text, where, one) {
  const entry = messages.get(text) ?? { where: new Set() };
  if (one) entry.one = one;
  entry.where.add(where);
  messages.set(text, entry);
}

const literal = (node) => (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined);
// A text, or either text of `condition ? 'a' : 'b'`.
const literals = (node) =>
  node && ts.isConditionalExpression(node) ? [...literals(node.whenTrue), ...literals(node.whenFalse)] : literal(node) === undefined ? [] : [literal(node)];
const isSetting = (text) => /^(https?:|mailto:|data:|var\(|[./#])/.test(text) || /^[a-z0-9-]+$/.test(text);

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return full === LOCALES ? [] : files(full);
    return /\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts') ? [full] : [];
  });
}

for (const file of files(SRC)) {
  const rel = path.relative(SRC, file);
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const content = rel.startsWith('content/');
  const lineOf = (node) => source.getLineAndCharacterOfPosition(node.getStart()).line + 1;

  // Is this node inside a top-level UPPER_CASE const of a component?
  const table = (node) => {
    for (let n = node; n; n = n.parent) {
      if (ts.isVariableDeclaration(n) && ts.isIdentifier(n.name) && /^[A-Z][A-Z_]+$/.test(n.name.text) && ts.isSourceFile(n.parent.parent.parent)) return n.name.text;
    }
  };
  // The property a string sits under in src/content/, skipping through arrays.
  const field = (node) => {
    for (let n = node.parent; n; n = n.parent) {
      if (ts.isPropertyAssignment(n)) return n.name.getText(source).replace(/['"]/g, '');
      if (ts.isVariableDeclaration(n)) return n.name.getText(source);
    }
  };
  // Inside an element marked translate="no"?
  const keptAsIs = (node) => {
    for (let n = node.parent; n; n = n.parent) {
      const opening = ts.isJsxElement(n) ? n.openingElement : ts.isJsxSelfClosingElement(n) ? n : null;
      if (opening?.attributes.properties.some((a) => ts.isJsxAttribute(a) && a.name.getText(source) === 'translate' && literal(a.initializer) === 'no')) return true;
    }
    return false;
  };

  const visit = (node) => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node) || ts.isTypeNode(node)) return;

    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const name = node.expression.text;
      if (name === 't' || name === 'rich') for (const text of literals(node.arguments[0])) add(text, `${rel}:${lineOf(node)}`);
      if (name === 'plural' && node.arguments[1] && ts.isObjectLiteralExpression(node.arguments[1])) {
        const forms = Object.fromEntries(
          node.arguments[1].properties.filter(ts.isPropertyAssignment).map((p) => [p.name.getText(source), literal(p.initializer)]),
        );
        if (forms.other) add(forms.other, `${rel}:${lineOf(node)}`, forms.one);
      }
    }

    const text = literal(node);
    if (text !== undefined && text.trim() && !isSetting(text)) {
      const parent = node.parent;
      const value = ts.isPropertyAssignment(parent) && parent.initializer === node;
      if (content) {
        // Data, not code: skip property names and strings compared or passed to functions.
        const name = ts.isPropertyAssignment(parent) && parent.name === node;
        const code = ts.isCallExpression(parent) || ts.isNewExpression(parent) || ts.isBinaryExpression(parent) || ts.isElementAccessExpression(parent);
        const key = field(node);
        if (!name && !code && !SETTINGS.has(key)) add(text, `${rel} · ${key}`);
      } else if (value) {
        const key = parent.name.getText(source);
        const owner = table(node);
        if (owner && TEXT_FIELDS.has(key)) add(text, `${rel} · ${owner}.${key}`);
      }
    }

    if (!ENGLISH_ONLY.has(rel)) {
      if (ts.isJsxText(node) && /[A-Za-z]{2,}/.test(node.text) && !BRAND.test(node.text) && !keptAsIs(node)) {
        untranslated.push(`${rel}:${lineOf(node)}  ${node.text.trim().slice(0, 70)}`);
      }
      if (ts.isJsxAttribute(node) && ['aria-label', 'alt', 'title', 'placeholder'].includes(node.name.getText(source))) {
        const value = literal(node.initializer);
        if (value && /[A-Za-z]{2,}/.test(value) && !keptAsIs(node)) untranslated.push(`${rel}:${lineOf(node)}  ${node.name.getText(source)}="${value}"`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

// ---------- Report ----------

const marks = (text) => ({
  vars: new Set(text.match(/\{\w+\}/g) ?? []),
  tags: (text.match(/<\/?\d+\/?>/g) ?? []).sort().join(' '),
});

const catalogAt = process.argv.indexOf('--catalog');
if (catalogAt > 0) {
  const out = [...messages].map(([text, entry], i) => ({
    id: String(i + 1),
    en: text,
    ...(entry.one ? { one: entry.one } : {}),
    where: [...entry.where].join('; '),
  }));
  fs.writeFileSync(process.argv[catalogAt + 1], `${JSON.stringify(out, null, 1)}\n`);
  console.log(`${out.length} texts written to ${process.argv[catalogAt + 1]}`);
  process.exit(0);
}

let problems = 0;
console.log(`${messages.size} English texts on the site.\n`);

for (const file of fs.existsSync(LOCALES) ? fs.readdirSync(LOCALES).filter((f) => f.endsWith('.json')).sort() : []) {
  const dictionary = JSON.parse(fs.readFileSync(path.join(LOCALES, file), 'utf8'));
  const missing = [...messages.keys()].filter((text) => !(text in dictionary));
  const unused = Object.keys(dictionary).filter((text) => !messages.has(text));
  const broken = Object.entries(dictionary).flatMap(([text, value]) => {
    if (!messages.has(text)) return [];
    const english = marks(`${text} ${messages.get(text).one ?? ''}`);
    const forms = typeof value === 'string' ? [value] : Object.values(value);
    return forms.flatMap((form) => {
      const got = marks(form);
      const extra = [...got.vars].filter((v) => !english.vars.has(v));
      const tags = marks(text).tags !== got.tags;
      return extra.length || tags ? [`${text}  →  ${form}`] : [];
    });
  });
  const name = file.replace('.json', '');
  console.log(`${name}: ${messages.size - missing.length}/${messages.size} translated`);
  for (const text of missing) console.log(`  missing  ${text}`);
  for (const text of broken) console.log(`  placeholders differ  ${text}`);
  for (const text of unused) console.log(`  no longer on the site  ${text}`);
  problems += missing.length + broken.length;
}

if (untranslated.length) {
  console.log(`\nEnglish shown without t() (wrap it, or mark the element translate="no"):`);
  for (const line of untranslated) console.log(`  ${line}`);
}
process.exit(problems || untranslated.length ? 1 : 0);
