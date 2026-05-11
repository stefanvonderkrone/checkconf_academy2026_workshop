/**
 * React Compiler compatibility checker.
 *
 * Runs `babel-plugin-react-compiler` in dry-run mode (`noEmit`) against
 * every `.ts`/`.tsx` file in the given path and reports which functions
 * the compiler can optimise, which it skips, and which cause errors.
 *
 * @example
 *   node scripts/check_compiler.mjs app/routes/suche/   # violations only
 *   node scripts/check_compiler.mjs --verbose app/      # all findings
 *
 * Flags:
 *   --verbose, -v   Show all findings including successful compilations.
 *                    Default behaviour shows violations only (errors / skips).
 *
 * Exit codes:
 *   0 — no compilation errors
 *   1 — one or more compilation errors detected
 *   2 — invalid usage (missing path argument)
 */

/* eslint-disable no-console */
import { readFileSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

import { transformFromAstSync } from '@babel/core';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import fg from 'fast-glob';

const traverse = _traverse.default ?? _traverse;

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const DIM = '\x1b[2m';
const BOLD = '\x1b[1m';

const argv = process.argv.slice(2);
const verbose = argv.includes('--verbose') || argv.includes('-v');
const targetPath = argv.find(arg => !arg.startsWith('-'));
if (!targetPath) {
    console.error(
        `${RED}Usage: node scripts/check_compiler.mjs [--verbose] <path>${RESET}`,
    );
    console.error(
        '  --verbose, -v  show all findings (default: violations only)',
    );
    console.error(
        '  e.g. node scripts/check_compiler.mjs app/routes/suche/angebot/components/price_calendar/',
    );
    process.exit(2);
}

const cwd = process.cwd();
const resolvedTarget = resolve(cwd, targetPath);

const stat = statSync(resolvedTarget, { throwIfNoEntry: false });

if (!stat) {
    console.error(`${RED}Path does not exist: ${targetPath}${RESET}`);
    process.exit(2);
}

const isSingleFile = stat.isFile();

const files = isSingleFile
    ? [resolvedTarget]
    : fg.sync(['**/*.{ts,tsx}'], {
          cwd: resolvedTarget,
          absolute: true,
          ignore: ['**/node_modules/**', '**/proto/**', '**/.react-router/**'],
      });

if (files.length === 0) {
    console.error(`${YELLOW}No .ts/.tsx files found in ${targetPath}${RESET}`);
    process.exit(0);
}

const totals = { success: 0, error: 0, skip: 0 };
const fileResults = [];

for (const filePath of files) {
    const relPath = relative(cwd, filePath);
    const source = readFileSync(filePath, 'utf-8');

    let ast;
    try {
        ast = parse(source, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
            sourceFilename: filePath,
        });
    } catch {
        fileResults.push({
            file: relPath,
            events: [{ kind: 'ParseError', detail: 'Failed to parse file' }],
        });
        continue;
    }

    const nameMap = buildNameMap(ast);
    const events = [];

    const logger = {
        logEvent(_filename, event) {
            events.push(event);
        },
    };

    try {
        transformFromAstSync(ast, source, {
            filename: filePath,
            highlightCode: false,
            retainLines: true,
            plugins: [
                [
                    'babel-plugin-react-compiler',
                    {
                        noEmit: true,
                        panicThreshold: 'none',
                        logger,
                    },
                ],
            ],
            presets: ['@babel/preset-typescript'],
            sourceType: 'module',
            configFile: false,
            babelrc: false,
        });
    } catch {
        // errors captured by logger
    }

    fileResults.push({ file: relPath, events, nameMap });
}

const VIOLATION_KINDS = new Set([
    'CompileError',
    'CompileSkip',
    'PipelineError',
    'ParseError',
]);

for (const { file, events, nameMap } of fileResults) {
    const relevant = events.filter(
        event =>
            event.kind === 'CompileSuccess' ||
            event.kind === 'CompileError' ||
            event.kind === 'CompileSkip' ||
            event.kind === 'PipelineError' ||
            event.kind === 'ParseError',
    );

    const fileCounts = countByKind(relevant);
    totals.success += fileCounts.success;
    totals.error += fileCounts.error;
    totals.skip += fileCounts.skip;

    const toShow = verbose
        ? relevant
        : relevant.filter(event => VIOLATION_KINDS.has(event.kind));

    if (toShow.length === 0) {
        continue;
    }

    const badge = formatFileBadge(fileCounts);
    console.log(`\n${BOLD}${file}${RESET}  ${badge}`);

    for (const event of toShow) {
        if (event.kind === 'CompileSuccess') {
            const name = resolveName(event.fnName, event.fnLoc, nameMap);
            const loc = formatLoc(event.fnLoc);
            const slots = event.memoSlots ?? 0;
            console.log(
                `  ${GREEN}✓${RESET} ${name} ${DIM}${loc}${RESET} ${DIM}(${slots} memo slots)${RESET}`,
            );
        } else if (event.kind === 'CompileError') {
            const name = resolveName(event.fnName, event.fnLoc, nameMap);
            const reason = event.detail?.reason ?? 'unknown';
            const loc = formatLoc(event.detail?.loc ?? event.fnLoc);
            console.log(
                `  ${RED}✗${RESET} ${name} ${RED}${reason}${RESET} ${DIM}${loc}${RESET}`,
            );
            if (event.detail?.description) {
                console.log(`    ${DIM}${event.detail.description}${RESET}`);
            }
        } else if (event.kind === 'CompileSkip') {
            const name = resolveName(
                event.fnName,
                event.fnLoc ?? event.loc,
                nameMap,
            );
            const reason = event.reason ?? 'unknown';
            const loc = formatLoc(event.loc ?? event.fnLoc);
            console.log(
                `  ${YELLOW}⊘${RESET} ${name} ${YELLOW}skip: ${reason}${RESET} ${DIM}${loc}${RESET}`,
            );
        } else if (event.kind === 'PipelineError') {
            console.log(`  ${RED}✗ pipeline error: ${event.data}${RESET}`);
        } else if (event.kind === 'ParseError') {
            console.log(`  ${RED}✗ ${event.detail}${RESET}`);
        }
    }
}

console.log(
    `\n${BOLD}Summary${RESET}: ${GREEN}${totals.success} compiled${RESET}, ${RED}${totals.error} errors${RESET}, ${YELLOW}${totals.skip} skipped${RESET}`,
);

if (totals.error > 0) {
    process.exit(1);
}

/**
 * Counts compiler events by category for a single file.
 *
 * @param {Array<{kind: string}>} events  Relevant compiler events.
 * @returns {{success: number, error: number, skip: number}}
 */
function countByKind(events) {
    const counts = { success: 0, error: 0, skip: 0 };
    for (const event of events) {
        if (event.kind === 'CompileSuccess') {
            counts.success++;
        } else if (
            event.kind === 'CompileError' ||
            event.kind === 'PipelineError' ||
            event.kind === 'ParseError'
        ) {
            counts.error++;
        } else if (event.kind === 'CompileSkip') {
            counts.skip++;
        }
    }

    return counts;
}

/**
 * Formats a coloured per-file summary badge.
 *
 * @example "3 errors, 2 skipped, 5 compiled"
 *
 * @param {{success: number, error: number, skip: number}} counts
 * @returns {string}
 */
function formatFileBadge(counts) {
    const parts = [];
    if (counts.error > 0) {
        parts.push(
            `${RED}${counts.error} error${counts.error === 1 ? '' : 's'}${RESET}`,
        );
    }
    if (counts.skip > 0) {
        parts.push(`${YELLOW}${counts.skip} skipped${RESET}`);
    }
    if (counts.success > 0) {
        parts.push(`${GREEN}${counts.success} compiled${RESET}`);
    }
    const separator = `${DIM}, ${RESET}`;

    return `${DIM}(${RESET}${parts.join(separator)}${DIM})${RESET}`;
}

/**
 * Formats a Babel source location into a human-readable `(line:col)` string.
 *
 * @param {import('@babel/types').SourceLocation | null | undefined} loc
 * @returns {string} Formatted location or empty string when unavailable.
 */
function formatLoc(loc) {
    if (!loc) {
        return '';
    }
    if (loc.start) {
        return `(${loc.start.line}:${loc.start.column})`;
    }

    return '';
}

/**
 * Creates a unique string key from a Babel source location.
 * Used as the key for {@link buildNameMap} lookups.
 *
 * @param {import('@babel/types').SourceLocation} loc
 * @returns {string} Key in the form `"line:column"`.
 */
function locKey(loc) {
    return `${loc.start.line}:${loc.start.column}`;
}

/**
 * Traverses the AST to build a mapping from source locations to
 * human-readable function names.
 *
 * The React Compiler plugin reports anonymous arrow functions / function
 * expressions without a name. This map lets us recover the name from:
 * - Variable declarations  (`const Foo = () => {}`)
 * - Default exports        (`export default () => {}` -> `"default export"`)
 * - Member assignments     (`obj.bar = () => {}` -> `"bar"`)
 *
 * @param {import('@babel/types').File} ast  Parsed Babel AST.
 * @returns {Map<string, string>} Map of `locKey` -> display name.
 */
function buildNameMap(ast) {
    const map = new Map();

    traverse(ast, {
        VariableDeclarator(path) {
            const init = path.get('init');
            if (
                !init.isArrowFunctionExpression() &&
                !init.isFunctionExpression()
            ) {
                return;
            }
            const idNode = path.node.id;
            if (idNode?.type === 'Identifier' && init.node.loc) {
                map.set(locKey(init.node.loc), idNode.name);
            }
        },
        ExportDefaultDeclaration(path) {
            const decl = path.get('declaration');
            if (
                !decl.isArrowFunctionExpression() &&
                !decl.isFunctionExpression()
            ) {
                return;
            }
            if (decl.node.loc) {
                map.set(locKey(decl.node.loc), 'default export');
            }
        },
        AssignmentExpression(path) {
            const right = path.get('right');
            if (
                !right.isArrowFunctionExpression() &&
                !right.isFunctionExpression()
            ) {
                return;
            }
            const left = path.node.left;
            if (left?.type === 'MemberExpression' && right.node.loc) {
                const prop = left.property;
                const name =
                    prop.type === 'Identifier' ? prop.name : String(prop.value);
                map.set(locKey(right.node.loc), name);
            }
        },
    });

    return map;
}

/**
 * Resolves a display name for a compiled function.
 *
 * Falls back through three sources in order:
 * 1. The name provided by the compiler plugin (`fnName`).
 * 2. A lookup in the {@link buildNameMap} result via the function's location.
 * 3. `"<anonymous>"` as a last resort.
 *
 * @param {string | undefined} fnName  Name reported by the compiler plugin.
 * @param {import('@babel/types').SourceLocation | undefined} fnLoc  Source location of the function.
 * @param {Map<string, string>} nameMap  Map built by {@link buildNameMap}.
 * @returns {string} Human-readable function name.
 */
function resolveName(fnName, fnLoc, nameMap) {
    if (fnName) {
        return fnName;
    }
    if (fnLoc) {
        const resolved = nameMap.get(locKey(fnLoc));
        if (resolved) {
            return resolved;
        }
    }

    return '<anonymous>';
}

