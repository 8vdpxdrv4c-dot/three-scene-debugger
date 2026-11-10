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
  'references/assets.md',
  'references/change-tracking.md',
  'references/inspectable-properties.md',
  'references/integration.md',
  'references/postfx.md',
  'references/textures.md',
  'references/troubleshooting.md',
  'references/ui.md',
  'scripts/build.cjs',
  'scripts/three-scene-debugger.js',
  'tests/README.md',
  'tests/browser.cjs',
  'tests/cli.cjs',
  'tests/results.log',
  'tests/runtime.cjs'
];

// assets/ 是可选的素材包（HDR 天空盒 + PBR 贴图，约 22 MB）。它整目录随包分发，
// 但不硬编码在 MANIFEST 里：没装素材的副本照样能安装，只是少了素材网格。
function discoverAssets() {
  const root = path.join(PACKAGE_ROOT, 'assets');
  let stat;
  try {
    stat = fs.lstatSync(root);
  } catch (error) {
    return [];
  }
  if (!stat.isDirectory() || stat.isSymbolicLink()) return [];
  const out = [];
  const walk = (abs, rel) => {
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const childAbs = path.join(abs, entry.name);
      const childRel = rel ? rel + '/' + entry.name : entry.name;
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) walk(childAbs, childRel);
      else if (entry.isFile()) out.push('assets/' + childRel);
    }
  };
  walk(root, '');
  return out.sort();
}

for (const rel of discoverAssets()) MANIFEST.push(rel);


const NEUTRAL = {
  id: 'agents',
  name: 'shared Agent Skills directory',
  project: ['.agents', 'skills'],
  global: ['.agents', 'skills'],
  source: 'https://agentskills.io/specification'
};

// Paths below are the directories each product's own docs tell users to create.
// discoversShared is true only when that same documentation also names .agents/skills.
const AGENTS = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    project: ['.claude', 'skills'],
    global: ['.claude', 'skills'],
    discoversShared: false,
    source: 'https://code.claude.com/docs/en/skills'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    project: ['.cursor', 'skills'],
    global: ['.cursor', 'skills'],
    discoversShared: true,
    source: 'https://cursor.com/docs/skills'
  },
  {
    id: 'codex',
    name: 'Codex',
    project: ['.agents', 'skills'],
    global: ['.agents', 'skills'],
    discoversShared: true,
    source: 'https://learn.chatgpt.com/docs/build-skills.md'
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot CLI',
    project: ['.github', 'skills'],
    global: ['.copilot', 'skills'],
    discoversShared: true,
    source: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills'
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    project: ['.gemini', 'skills'],
    global: ['.gemini', 'skills'],
    discoversShared: true,
    source: 'https://geminicli.com/docs/cli/skills/'
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    project: ['.opencode', 'skills'],
    global: ['.config', 'opencode', 'skills'],
    discoversShared: true,
    source: 'https://opencode.ai/docs/skills/'
  }
];

function agentById(id, catalog) {
  if (id === NEUTRAL.id) return NEUTRAL;
  return (catalog || AGENTS).find((agent) => agent.id === id) || null;
}

function listAgentsText() {
  const shared = AGENTS.filter((agent) => agent.discoversShared).map((agent) => agent.id).join(', ');
  const rows = [NEUTRAL].concat(AGENTS).map((agent) => {
    const project = agent.project.concat(SKILL_NAME).join('/');
    const globalDir = agent.global ? '~/' + agent.global.concat(SKILL_NAME).join('/') : '(none)';
    return agent.id + '\t' + project + '\t' + globalDir;
  });
  return [
    'three-scene-debugger skill directories',
    '',
    'Default when --agent is omitted (no prompt, including when stdin is not a TTY):',
    '  project  .agents/skills/' + SKILL_NAME,
    '  global   ~/.agents/skills/' + SKILL_NAME,
    'Official docs that discover this shared directory: ' + shared + '.',
    'Claude Code docs list .claude/skills and ~/.claude/skills, not .agents/skills.',
    'The Agent Skills specification defines SKILL.md layout and does not require this path.',
    '',
    'id\tproject\tglobal',
    rows.join('\n'),
    '',
    '--agent may be repeated or comma-separated. Duplicate ids and identical',
    'directories are installed once. --target <dir> writes only that directory',
    'and does not register it with an agent, so discovery is not implied.',
    'An agent with no documented global directory is an error under --global;',
    'the installer does not substitute another product directory.',
    '',
    'Sources:',
    AGENTS.map((agent) => '  ' + agent.id + '  ' + agent.source).join('\n'),
    '  specification  ' + NEUTRAL.source,
    ''
  ].join('\n');
}

const HELP = `three-scene-debugger — copy the Three.js scene debugger Agent Skill into a directory

This command only copies files. It does not start the browser debugger, run
project scripts, read secrets, scan the project for agent config, or install
Three.js. The debugger runtime is the library in dist/ and scripts/, imported
by the app behind a DEV check.

Usage:
  three-scene-debugger install [options]
  three-scene-debugger --list-agents
  three-scene-debugger --help
  three-scene-debugger --version

Options:
  --agent <id>       Install for one documented agent. Repeat or use commas.
  --global           Use that agent's documented user directory, or the shared
                     ~/.agents/skills directory when --agent is omitted
  --target <dir>     Copy into this exact directory (it will contain SKILL.md)
  --force            Update an existing install of this skill
  --list-agents      Print the path table and sources, then exit
  -h, --help         Show this help
  -v, --version      Show the package version

Default directory, from the current working directory, with no prompt:
  .agents/skills/${SKILL_NAME}

That shared directory is documented for Cursor, Codex, GitHub Copilot CLI,
Gemini CLI, and OpenCode. It is not the documented Claude Code directory.
Use --agent claude-code for .claude/skills/${SKILL_NAME}. Run --list-agents
for every id, project path, global path, and source URL.

--target cannot be combined with --agent or --global. --target is not
shell-expanded, so pass a real path instead of "~". A custom path is not
automatically discovered. --global uses the process home directory only for
a path the selected agent documents.

A missing directory is created. An empty directory is filled. If every skill
file is already identical, the command exits 0 without rewriting files. A
different existing install of this skill is left untouched unless --force is
set. --force replaces regular files from this skill's file list only: it does
not delete unrelated files and it does not replace or follow symlinks.

A non-empty directory that is not already this skill is refused, with or
without --force. Every destination is checked before any copy. Symlink path
components, symlink destinations, and system directories are refused.

GitHub install (the npx package runs this installer; it is not the browser UI):
  npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install
  npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent claude-code
  npx --yes --package=github:8vdpxdrv4c-dot/three-scene-debugger three-scene-debugger install --agent cursor,opencode

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

function homeDirectory() {
  const home = os.homedir();
  if (!home || home === path.parse(home).root) throw refuse('Cannot resolve a safe home directory');
  return home;
}

function resolvePlans(options, catalog) {
  if (options.target && (options.global || options.agents.length > 0)) {
    throw refuse('Use --target alone. It is a custom directory, not an agent discovery path, and cannot be combined with --agent or --global.');
  }
  if (options.target) {
    return [{ id: 'target', name: 'custom directory', requested: options.target, scope: 'custom' }];
  }
  const scope = options.global ? 'global' : 'project';
  const base = options.global ? homeDirectory() : process.cwd();
  const selected = options.agents.length > 0 ? options.agents : [NEUTRAL.id];
  const plans = [];
  const seen = new Set();
  for (const id of selected) {
    const agent = agentById(id, catalog);
    if (!agent) throw refuse('Unknown agent: ' + id + '. Run three-scene-debugger --list-agents');
    const segments = agent[scope];
    if (!segments) {
      throw refuse(
        agent.id + ' has no documented ' + scope + ' skills directory. Refusing to use another agent directory. Use --target for a custom path.'
      );
    }
    const requested = path.join(base, ...segments, SKILL_NAME);
    if (seen.has(requested)) continue;
    seen.add(requested);
    plans.push({ id: agent.id, name: agent.name, requested, scope });
  }
  return plans;
}

function discoveryNote(plan) {
  if (plan.id === 'target') {
    return 'Custom path: no agent is configured by this installer to discover this directory.';
  }
  if (plan.scope !== 'custom' && (plan.id === NEUTRAL.id || plan.id === 'codex')) {
    const names = AGENTS.filter((agent) => agent.discoversShared).map((agent) => agent.name).join(', ');
    return 'Shared directory. Documented discovery: ' + names + '. Claude Code docs do not list this path.';
  }
  return 'Documented ' + plan.scope + ' directory for ' + plan.name + '.';
}

function classifyDestination(destRoot, sources) {
  const inspected = inspectDestination(destRoot);
  if (inspected.kind === 'foreign') return 'foreign';
  if (inspected.kind === 'skill') return planExistingSkill(destRoot, sources);
  return 'create';
}

function install(options, pkg, catalog) {
  const plans = resolvePlans(options, catalog);
  const sources = loadSources();
  const prepared = plans.map((plan) => {
    const destRoot = resolveSafe(plan.requested);
    assertNotSystem(destRoot);
    if (path.resolve(destRoot) === path.resolve(PACKAGE_ROOT)) {
      throw refuse('Refusing to install onto the package directory itself. Use a project directory, --global, or --target.');
    }
    for (const source of sources) {
      const destFile = path.join(destRoot, ...source.rel.split('/'));
      if (!isInside(destRoot, destFile)) throw refuse('Refusing path that escapes the destination: ' + destFile);
    }
    const action = classifyDestination(destRoot, sources);
    return { plan, destRoot, action };
  });
  const foreign = prepared.filter((item) => item.action === 'foreign');
  if (foreign.length > 0) {
    throw refuse(
      'Refusing to overwrite existing directory (not an installed three-scene-debugger skill): ' +
      foreign.map((item) => item.destRoot).join(', ') +
      '\n--force only updates an existing install of this skill and does not delete unrelated files. No destination was changed.'
    );
  }
  const needsForce = prepared.filter((item) => item.action === 'differs');
  if (needsForce.length > 0 && !options.force) {
    throw refuse(
      'Skill directory already exists and differs. Re-run with --force to update this skill\'s files only: ' +
      needsForce.map((item) => item.destRoot).join(', ') +
      '\nNo destination was changed.'
    );
  }
  for (const item of prepared) {
    if (item.action === 'unchanged') {
      console.log('Already installed (unchanged): ' + item.destRoot);
      console.log(discoveryNote(item.plan));
      continue;
    }
    if (item.action === 'create') mkdirSafe(item.destRoot);
    let wrote = 0;
    for (const source of sources) wrote += writeOwnedFile(item.destRoot, source) ? 1 : 0;
    if (item.action === 'differs') {
      console.log('Updated ' + SKILL_NAME + ' ' + pkg.version + ' at ' + item.destRoot + ' (' + wrote + ' files; unrelated files were left in place)');
    } else {
      console.log('Installed ' + SKILL_NAME + ' ' + pkg.version + ' to ' + item.destRoot);
    }
    console.log(discoveryNote(item.plan));
  }
}

function addAgent(options, raw) {
  if (!raw || raw.startsWith('-')) throw refuse('Missing value for --agent');
  const parts = raw.split(',');
  if (parts.length === 0) throw refuse('Missing value for --agent');
  for (const part of parts) {
    const id = part.trim();
    if (!id) throw refuse('Missing value for --agent');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw refuse('Unknown agent: ' + id + '. Run three-scene-debugger --list-agents');
    if (!options.agents.includes(id)) options.agents.push(id);
  }
}

function parseArgs(argv) {
  const options = { help: false, version: false, listAgents: false, global: false, force: false, target: null, agents: [], command: null };
  const args = argv.slice(2);
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg.includes('\0')) throw refuse('Invalid argument');
    if (arg === '--help' || arg === '-h') { options.help = true; continue; }
    if (arg === '--version' || arg === '-v') { options.version = true; continue; }
    if (arg === '--list-agents') { options.listAgents = true; continue; }
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
    if (arg === '--agent' || arg.startsWith('--agent=')) {
      const value = arg === '--agent' ? args[index + 1] : arg.slice('--agent='.length);
      if (arg === '--agent') index += 1;
      addAgent(options, value);
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
  if (options.listAgents || options.command === 'list-agents') {
    process.stdout.write(listAgentsText());
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

module.exports = { MANIFEST, SKILL_NAME, PACKAGE_ROOT, AGENTS, NEUTRAL, main, resolvePlans, install };
