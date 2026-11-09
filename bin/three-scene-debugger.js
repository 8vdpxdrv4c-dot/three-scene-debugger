#!/usr/bin/env node
'use strict';

// File-copy installer for the three-scene-debugger Agent Skill.
// Uses only Node.js standard libraries. It does not start the browser
// debugger, execute project code, read secrets, open a network connection,
// or install Three.js.

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SKILL_NAME = 'three-scene-debugger';
const PACKAGE_ROOT = path.resolve(__dirname, '..');

const MANIFEST = [
  'LICENSE',
  'README.md',
  'SKILL.md',
  'bin/three-scene-debugger.js',
  'dist/three-scene-debugger.js',
  'dist/three-scene-debugger.mjs',
  'package.json',
  'references/change-tracking.md',
  'references/inspectable-properties.md',
  'references/integration.md',
  'references/troubleshooting.md',
  'scripts/build.cjs',
  'scripts/three-scene-debugger.js',
  'tests/README.md',
  'tests/browser.cjs',
  'tests/cli.cjs',
  'tests/results.log',
  'tests/runtime.cjs'
];

const HELP = `three-scene-debugger — copy the Three.js scene debugger Agent Skill into a directory

This command only copies files. It does not start the browser debugger, run
project scripts, read secrets, or install Three.js. The debugger runtime is
the library in dist/ and scripts/, imported by your app behind a DEV check.

Usage:
  three-scene-debugger install [options]
  three-scene-debugger --help
  three-scene-debugger --version

Options:
  --global           Install to ~/.claude/skills/${SKILL_NAME}
  --target <dir>     Install into this exact directory (it will contain SKILL.md)
  --force            Update an existing install of this skill
  -h, --help         Show this help
  -v, --version      Show the package version

Default directory, resolved from the current working directory:
  .claude/skills/${SKILL_NAME}

--global and --target cannot be combined. --target is not shell-expanded, so
pass a real path instead of "~". --global uses the process home directory.
A missing directory is created.
An empty directory is filled. If every skill file is already identical, the
command exits 0 without rewriting files. A different existing install of this
skill is left untouched unless --force is set. --force replaces regular files
from this skill's file list only: it does not delete unrelated files and it
does not replace or follow symlinks.

A non-empty directory that is not already this skill is refused, with or
without --force. Paths are resolved before copying. Symlink path components,
symlink destinations, and system directories are refused. The file list cannot
escape the destination.

GitHub install (the npx package runs this installer; it is not the browser UI):
  npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
  npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --global
  npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --target <dir>

That GitHub spec tracks the repository default branch. This package is not
published to the npm registry; bare "npx three-scene-debugger" is not a
registry command.
`;

function refuse(message) {
  const error = new Error(message);
  error.code = 'TSD_REFUSE';
  return error;
}

function nodeMajor() {
  return Number(process.versions.node.split('.')[0]);
}

function readPackage() {
  const packagePath = path.join(PACKAGE_ROOT, 'package.json');
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } catch (error) {
    throw refuse('Could not read package.json: ' + error.message);
  }
  if (!parsed || parsed.name !== SKILL_NAME || typeof parsed.version !== 'string' || parsed.version.length === 0) {
    throw refuse('package.json must declare name three-scene-debugger and a version');
  }
  return parsed;
}

function assertRelative(rel) {
  if (typeof rel !== 'string' || rel.length === 0 || rel.includes('\0') || rel.includes('\\') || path.isAbsolute(rel)) {
    throw refuse('Unsafe skill path: ' + rel);
  }
  const parts = rel.split('/');
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw refuse('Unsafe skill path: ' + rel);
  }
}

function loadSources() {
  let rootReal;
  try {
    rootReal = fs.realpathSync(PACKAGE_ROOT);
  } catch (error) {
    throw refuse('Could not resolve the package directory: ' + error.message);
  }
  return MANIFEST.map((rel) => {
    assertRelative(rel);
    const absolute = path.resolve(PACKAGE_ROOT, rel);
    let stat;
    try {
      stat = fs.lstatSync(absolute);
    } catch (error) {
      throw refuse('Skill source is missing: ' + rel + ' (' + error.message + ')');
    }
    if (stat.isSymbolicLink() || !stat.isFile()) {
      throw refuse('Skill source is not a regular file: ' + rel);
    }
    const real = fs.realpathSync(absolute);
    const fromRoot = path.relative(rootReal, real);
    if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) {
      throw refuse('Skill source escapes the package: ' + rel);
    }
    return { rel, data: fs.readFileSync(absolute) };
  });
}

function parseSkillName(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text);
  if (!match) return null;
  for (const line of match[1].split(/\r?\n/)) {
    const found = /^name:\s*(\S+)\s*$/.exec(line);
    if (found) return found[1].replace(/^["']|["']$/g, '');
  }
  return null;
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative));
}

function assertNotSystem(abs) {
  const root = path.parse(abs).root;
  if (abs === root) throw refuse('Refusing to install into the filesystem root');
  const home = os.homedir();
  if (home && abs === path.resolve(home)) throw refuse('Refusing to install into the home directory itself');
  const blocked = process.platform === 'win32'
    ? [process.env.WINDIR || 'C:\\Windows', process.env.ProgramFiles || 'C:\\Program Files']
    : ['/etc', '/usr', '/bin', '/sbin', '/lib', '/lib64', '/boot', '/proc', '/sys', '/dev', '/run'];
  for (const prefix of blocked) {
    if (!prefix) continue;
    const resolved = path.resolve(prefix);
    if (abs === resolved || isInside(resolved, abs)) {
      throw refuse('Refusing to install into a system directory: ' + abs);
    }
  }
}

function resolveSafe(input) {
  if (typeof input !== 'string' || input.length === 0 || input.includes('\0')) {
    throw refuse('Invalid destination path');
  }
  const abs = path.resolve(input);
  const root = path.parse(abs).root;
  let current = root;
  const parts = abs.slice(root.length).split(path.sep).filter(Boolean);
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (part === '.' || part === '..') throw refuse('Invalid destination path');
    current = path.join(current, part);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error.code === 'ENOENT') return abs;
      throw error;
    }
    if (stat.isSymbolicLink()) throw refuse('Refusing to follow symlink: ' + current);
    const isLast = index === parts.length - 1;
    if (!isLast && !stat.isDirectory()) throw refuse('Not a directory: ' + current);
  }
  return abs;
}

function mkdirSafe(dir) {
  const root = path.parse(dir).root;
  let current = root;
  for (const part of dir.slice(root.length).split(path.sep).filter(Boolean)) {
    if (part === '.' || part === '..') throw refuse('Invalid destination path');
    current = path.join(current, part);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      fs.mkdirSync(current);
      continue;
    }
    if (stat.isSymbolicLink()) throw refuse('Refusing to follow symlink: ' + current);
    if (!stat.isDirectory()) throw refuse('Not a directory: ' + current);
  }
}

function assertTreeSafe(destRoot, rel) {
  const parts = rel.split('/');
  let current = destRoot;
  for (let index = 0; index < parts.length; index += 1) {
    current = path.join(current, parts[index]);
    if (!isInside(destRoot, current)) throw refuse('Refusing path that escapes the destination: ' + current);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error.code === 'ENOENT') return;
      throw error;
    }
    if (stat.isSymbolicLink()) throw refuse('Refusing to follow symlink: ' + current);
    const isLast = index === parts.length - 1;
    if (!isLast && !stat.isDirectory()) throw refuse('Not a directory: ' + current);
    if (isLast && !stat.isFile()) throw refuse('Refusing to replace non-regular file: ' + current);
  }
}

function sameBytes(file, data) {
  return fs.readFileSync(file).equals(data);
}

function inspectDestination(destRoot) {
  let stat;
  try {
    stat = fs.lstatSync(destRoot);
  } catch (error) {
    if (error.code === 'ENOENT') return { kind: 'missing' };
    throw error;
  }
  if (stat.isSymbolicLink()) throw refuse('Refusing to follow symlink: ' + destRoot);
  if (!stat.isDirectory()) throw refuse('Refusing to replace non-directory: ' + destRoot);
  const entries = fs.readdirSync(destRoot);
  if (entries.length === 0) return { kind: 'empty' };
  const skillPath = path.join(destRoot, 'SKILL.md');
  let skillStat;
  try {
    skillStat = fs.lstatSync(skillPath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return { kind: 'foreign' };
  }
  if (skillStat.isSymbolicLink()) throw refuse('Refusing to follow symlink: ' + skillPath);
  if (!skillStat.isFile()) throw refuse('Refusing to replace non-regular file: ' + skillPath);
  let name;
  try {
    name = parseSkillName(fs.readFileSync(skillPath, 'utf8'));
  } catch (error) {
    throw refuse('Could not read SKILL.md: ' + error.message);
  }
  if (name !== SKILL_NAME) return { kind: 'foreign' };
  return { kind: 'skill' };
}

function planExistingSkill(destRoot, sources) {
  let differs = false;
  for (const source of sources) {
    const destFile = path.join(destRoot, ...source.rel.split('/'));
    assertTreeSafe(destRoot, source.rel);
    let stat;
    try {
      stat = fs.lstatSync(destFile);
    } catch (error) {
      if (error.code === 'ENOENT') {
        differs = true;
        continue;
      }
      throw error;
    }
    if (stat.isSymbolicLink() || !stat.isFile()) {
      throw refuse('Refusing to replace non-regular file: ' + destFile);
    }
    if (!sameBytes(destFile, source.data)) differs = true;
  }
  return differs ? 'differs' : 'unchanged';
}

function writeOwnedFile(destRoot, source) {
  const destFile = path.join(destRoot, ...source.rel.split('/'));
  if (!isInside(destRoot, destFile)) throw refuse('Refusing path that escapes the destination: ' + destFile);
  if (path.resolve(destFile) === path.resolve(PACKAGE_ROOT, source.rel)) {
    throw refuse('Refusing to copy a package file onto itself: ' + source.rel);
  }
  assertTreeSafe(destRoot, source.rel);
  let existing;
  try {
    existing = fs.lstatSync(destFile);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (existing && (existing.isSymbolicLink() || !existing.isFile())) {
    throw refuse('Refusing to replace non-regular file: ' + destFile);
  }
  if (existing && sameBytes(destFile, source.data)) return false;
  mkdirSafe(path.dirname(destFile));
  const tmp = path.join(path.dirname(destFile), '.tsd-' + process.pid + '-' + crypto.randomBytes(8).toString('hex'));
  try {
    fs.writeFileSync(tmp, source.data, { flag: 'wx', mode: 0o644 });
    const written = fs.lstatSync(tmp);
    if (written.isSymbolicLink() || !written.isFile()) {
      throw refuse('Temporary copy is not a regular file');
    }
    commitTemp(tmp, destFile);
  } catch (error) {
    try { fs.unlinkSync(tmp); } catch (cleanupError) { if (cleanupError.code !== 'ENOENT') throw cleanupError; }
    throw error;
  }
  return true;
}

function commitTemp(tmp, destFile) {
  let existing;
  try {
    existing = fs.lstatSync(destFile);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!existing) {
    try {
      fs.linkSync(tmp, destFile);
    } catch (error) {
      if (error.code === 'EEXIST') existing = fs.lstatSync(destFile);
      else {
        fs.renameSync(tmp, destFile);
        return;
      }
    }
    if (!existing) {
      fs.unlinkSync(tmp);
      return;
    }
  }
  if (!existing || existing.isSymbolicLink() || !existing.isFile()) {
    throw refuse('Refusing to replace non-regular file: ' + destFile);
  }
  if (process.platform === 'win32') {
    const again = fs.lstatSync(destFile);
    if (again.isSymbolicLink() || !again.isFile()) {
      throw refuse('Refusing to replace non-regular file: ' + destFile);
    }
    fs.unlinkSync(destFile);
  }
  fs.renameSync(tmp, destFile);
}

function destinationFor(options) {
  if (options.global && options.target) {
    throw refuse('Use either --global or --target, not both');
  }
  if (options.global) {
    const home = os.homedir();
    if (!home || home === path.parse(home).root) throw refuse('Cannot resolve a safe home directory');
    return path.join(home, '.claude', 'skills', SKILL_NAME);
  }
  if (options.target) return options.target;
  return path.join(process.cwd(), '.claude', 'skills', SKILL_NAME);
}

function install(options, pkg) {
  const requested = destinationFor(options);
  const destRoot = resolveSafe(requested);
  assertNotSystem(destRoot);
  if (path.resolve(destRoot) === path.resolve(PACKAGE_ROOT)) {
    throw refuse('Refusing to install onto the package directory itself. Use a project directory, --global, or --target.');
  }
  const sources = loadSources();
  for (const source of sources) {
    const destFile = path.join(destRoot, ...source.rel.split('/'));
    if (!isInside(destRoot, destFile)) throw refuse('Refusing path that escapes the destination: ' + destFile);
  }
  const inspected = inspectDestination(destRoot);
  if (inspected.kind === 'foreign') {
    throw refuse(
      'Refusing to overwrite existing directory (not an installed three-scene-debugger skill): ' + destRoot +
      '\n--force only updates an existing install of this skill and does not delete unrelated files.'
    );
  }
  if (inspected.kind === 'skill') {
    const plan = planExistingSkill(destRoot, sources);
    if (plan === 'unchanged') {
      console.log('Already installed (unchanged): ' + destRoot);
      return;
    }
    if (!options.force) {
      throw refuse('Skill directory already exists and differs. Re-run with --force to update this skill\'s files only: ' + destRoot);
    }
    let wrote = 0;
    for (const source of sources) wrote += writeOwnedFile(destRoot, source) ? 1 : 0;
    console.log('Updated ' + SKILL_NAME + ' ' + pkg.version + ' at ' + destRoot + ' (' + wrote + ' files; unrelated files were left in place)');
    return;
  }
  if (options.force && inspected.kind === 'missing') {
    // --force is unnecessary for a new directory, and it still only writes the manifest.
  }
  mkdirSafe(destRoot);
  for (const source of sources) writeOwnedFile(destRoot, source);
  console.log('Installed ' + SKILL_NAME + ' ' + pkg.version + ' to ' + destRoot);
}

function parseArgs(argv) {
  const options = { help: false, version: false, global: false, force: false, target: null, command: null };
  const args = argv.slice(2);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.includes('\0')) throw refuse('Invalid argument');
    if (arg === '--help' || arg === '-h') { options.help = true; continue; }
    if (arg === '--version' || arg === '-v') { options.version = true; continue; }
    if (arg === '--global') { options.global = true; continue; }
    if (arg === '--force') { options.force = true; continue; }
    if (arg === '--target' || arg.startsWith('--target=')) {
      const value = arg === '--target' ? args[index + 1] : arg.slice('--target='.length);
      if (arg === '--target') index += 1;
      if (!value || value.startsWith('-')) throw refuse('Missing value for --target');
      if (options.target) throw refuse('Only one --target is allowed');
      options.target = value;
      continue;
    }
    if (arg === '--') continue;
    if (arg.startsWith('-')) throw refuse('Unknown option: ' + arg);
    if (options.command) throw refuse('Unexpected argument: ' + arg);
    options.command = arg;
  }
  return options;
}

function main(argv) {
  if (nodeMajor() < 18) throw refuse('three-scene-debugger requires Node.js >= 18');
  const pkg = readPackage();
  const options = parseArgs(argv || process.argv);
  if (options.help || options.command === 'help') {
    process.stdout.write(HELP);
    return;
  }
  if (options.version || options.command === 'version') {
    process.stdout.write(SKILL_NAME + ' ' + pkg.version + '\n');
    return;
  }
  if (!options.command) throw refuse('Missing command. Run three-scene-debugger --help');
  if (options.command !== 'install') throw refuse('Unknown command: ' + options.command + '. Run three-scene-debugger --help');
  install(options, pkg);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    if (error && error.code === 'TSD_REFUSE') console.error(error.message);
    else console.error(error && error.stack ? error.stack : String(error));
    process.exitCode = 1;
  }
}

module.exports = { MANIFEST, SKILL_NAME, PACKAGE_ROOT, main };
