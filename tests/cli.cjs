// Installer checks. Node standard library only; no Three.js and no browser.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repo = path.resolve(__dirname, '..');
const cli = path.join(repo, 'bin', 'three-scene-debugger.js');
const { MANIFEST, SKILL_NAME, AGENTS, main, resolvePlans } = require(cli);
const pkg = JSON.parse(fs.readFileSync(path.join(repo, 'package.json'), 'utf8'));
const cleanup = [];
let passed = 0;

function reserved(dir) {
  cleanup.push(dir);
  return dir;
}

function tempDir(prefix) {
  return reserved(fs.mkdtempSync(path.join(os.tmpdir(), prefix)));
}

function run(args, cwd, home) {
  const env = Object.assign({}, process.env, {
    HOME: home,
    USERPROFILE: home,
    npm_config_update_notifier: 'false',
    npm_config_fund: 'false',
    npm_config_audit: 'false'
  });
  delete env.npm_config_prefix;
  return spawnSync(process.execPath, [cli].concat(args), {
    cwd: cwd,
    env: env,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
}

function expectFail(result, pattern) {
  assert.notEqual(result.status, 0, 'expected failure, stdout=' + result.stdout + ' stderr=' + result.stderr);
  assert.match(result.stderr, pattern);
}

function filesUnder(dir) {
  const found = [];
  if (!fs.existsSync(dir)) return found;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.isSymbolicLink()) found.push.apply(found, filesUnder(absolute));
    else found.push(absolute);
  }
  return found;
}

function relativePosix(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function sha(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function assertSkillTree(dest) {
  const found = filesUnder(dest).map((file) => relativePosix(dest, file)).sort();
  assert.deepEqual(found, MANIFEST.slice().sort());
  const skill = fs.readFileSync(path.join(dest, 'SKILL.md'), 'utf8');
  const front = skill.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  assert.ok(front, 'SKILL.md frontmatter');
  assert.match(front[0], /^name:\s*three-scene-debugger\s*$/m);
  const body = skill.slice(front[0].length).replace(/\n$/, '');
  assert.ok(body.split('\n').length < 500, 'SKILL.md body must stay under 500 lines');
  assert.equal(path.basename(path.join(dest, 'SKILL.md')), 'SKILL.md');
  const referenced = skill.match(/(?:references|scripts|dist|tests)\/[A-Za-z0-9._/-]+/g) || [];
  for (const ref of referenced) {
    assert.ok(fs.existsSync(path.join(dest, ref)), 'missing skill resource ' + ref);
  }
  assert.ok(!found.some((file) => file === 'node_modules' || file.startsWith('node_modules/')));
  assert.ok(!fs.existsSync(path.join(dest, 'node_modules')));
  assert.ok(!fs.existsSync(path.join(dest, 'node_modules', 'three')));
  for (const file of found) assert.ok(!file.split('/').includes('..'));
  const core = fs.readFileSync(path.join(dest, 'scripts', 'three-scene-debugger.js'));
  assert.ok(core.length < 120000);
  assert.equal(sha(path.join(dest, 'scripts', 'three-scene-debugger.js')), sha(path.join(repo, 'scripts', 'three-scene-debugger.js')));
  assert.equal(sha(path.join(dest, 'dist', 'three-scene-debugger.mjs')), sha(path.join(repo, 'dist', 'three-scene-debugger.mjs')));
}

function test(name, fn) {
  fn();
  passed += 1;
  console.log('PASS', name);
}

const home = tempDir('tsd-home-');
const coreBefore = sha(path.join(repo, 'scripts', 'three-scene-debugger.js'));
const esmBefore = sha(path.join(repo, 'dist', 'three-scene-debugger.mjs'));

try {
  test('package metadata is an installable GitHub package, not a second Three', () => {
    assert.equal(pkg.name, SKILL_NAME);
    assert.equal(pkg.private, undefined);
    assert.equal(pkg.dependencies, undefined);
    assert.equal(pkg.devDependencies, undefined);
    assert.equal(pkg.peerDependencies.three, '>=0.160.0 <1');
    assert.equal(pkg.bin[SKILL_NAME], './bin/three-scene-debugger.js');
    assert.ok(pkg.engines && pkg.engines.node);
    assert.match(pkg.engines.node, /18/);
    for (const entry of ['bin', 'dist', 'scripts', 'references', 'tests', 'SKILL.md']) {
      assert.ok(pkg.files.includes(entry), entry);
    }
    assert.equal(pkg.scripts.test, 'node tests/cli.cjs');
    assert.equal(pkg.scripts['test:runtime'], 'node tests/runtime.cjs');
    assert.ok(!pkg.scripts.prepack.includes('tests'));
    const required = [
      'SKILL.md', 'README.md', 'LICENSE', 'package.json',
      'bin/three-scene-debugger.js',
      'scripts/three-scene-debugger.js', 'scripts/build.cjs',
      'dist/three-scene-debugger.js', 'dist/three-scene-debugger.mjs',
      'references/integration.md', 'references/inspectable-properties.md',
      'references/change-tracking.md', 'references/troubleshooting.md',
      'tests/runtime.cjs', 'tests/browser.cjs', 'tests/README.md'
    ];
    for (const rel of required) assert.ok(MANIFEST.includes(rel), rel);
    const cliSource = fs.readFileSync(cli, 'utf8');
    assert.ok(cliSource.startsWith('#!/usr/bin/env node'));
    for (const banned of ["child_process", "require('three'", 'require("three"', 'node:http', 'node:https', 'node:net', 'eval(', 'Function(', 'readline', 'isTTY']) {
      assert.equal(cliSource.includes(banned), false, banned);
    }
    const core = fs.readFileSync(path.join(repo, 'scripts', 'three-scene-debugger.js'), 'utf8');
    assert.equal(core.includes("require('three'"), false);
    assert.equal(core.includes("from 'three'"), false);
    assert.equal(core.includes('from "three"'), false);
  });

  test('help and version do not install and do not require a target', () => {
    const cwd = tempDir('tsd-help-');
    const help = run(['--help'], cwd, home);
    assert.equal(help.status, 0, help.stderr);
    assert.match(help.stdout, /three-scene-debugger install/);
    assert.match(help.stdout, /does not start the browser debugger/);
    assert.match(help.stdout, /published to the npm registry/);
    assert.equal(fs.existsSync(path.join(cwd, '.claude')), false);
    const version = run(['--version'], cwd, home);
    assert.equal(version.status, 0, version.stderr);
    assert.equal(version.stdout.trim(), SKILL_NAME + ' ' + pkg.version);
    const missing = run([], cwd, home);
    expectFail(missing, /Missing command/);
    expectFail(run(['explode'], cwd, home), /Unknown command/);
    expectFail(run(['install', '--nope'], cwd, home), /Unknown option/);
    expectFail(run(['install', '--global', '--target', path.join(cwd, 'x')], cwd, home), /--target alone/);
    assert.equal(fs.existsSync(path.join(cwd, '.claude')), false);
    assert.equal(fs.existsSync(path.join(home, '.claude')), false);
  });

  test('default project install, sibling skill, idempotent rerun, and no project execution', () => {
    const cwd = tempDir('tsd-proj-');
    fs.mkdirSync(path.join(cwd, '.agents', 'skills', 'other-skill'), { recursive: true });
    fs.writeFileSync(path.join(cwd, '.agents', 'skills', 'other-skill', 'SKILL.md'), '---\nname: other-skill\n---\nleave me\n');
    const secret = 'SECRET-' + crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(path.join(cwd, '.env'), secret);
    fs.writeFileSync(path.join(cwd, 'package.json'), JSON.stringify({
      scripts: { preinstall: 'touch pwned', postinstall: 'touch pwned', prepare: 'touch pwned' }
    }));
    const sentinel = path.join(repo, '.cli-test-sentinel');
    const sentinelText = 'SENTINEL-' + crypto.randomBytes(16).toString('hex');
    fs.writeFileSync(sentinel, sentinelText);
    try {
      const result = run(['install'], cwd, home);
      assert.equal(result.status, 0, result.stderr);
      const dest = path.join(cwd, '.agents', 'skills', SKILL_NAME);
      assert.match(result.stdout, new RegExp('Installed ' + SKILL_NAME + ' ' + pkg.version));
      assert.equal(result.stdout.includes(dest), true);
      assertSkillTree(dest);
      const dumped = filesUnder(dest).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
      assert.equal(dumped.includes(secret), false);
      assert.equal(dumped.includes(sentinelText), false);
      assert.equal(fs.existsSync(path.join(cwd, 'pwned')), false);
      assert.equal(fs.readFileSync(path.join(cwd, '.agents', 'skills', 'other-skill', 'SKILL.md'), 'utf8').includes('leave me'), true);
      assert.equal(fs.existsSync(path.join(cwd, '.claude')), false);
      const before = fs.statSync(path.join(dest, 'SKILL.md'));
      const again = run(['install'], cwd, home);
      assert.equal(again.status, 0, again.stderr);
      assert.match(again.stdout, /unchanged/);
      const after = fs.statSync(path.join(dest, 'SKILL.md'));
      assert.equal(after.mtimeMs, before.mtimeMs);
      assert.equal(after.ino, before.ino);
      assert.equal(filesUnder(dest).some((file) => path.basename(file).startsWith('.tsd-')), false);
    } finally {
      fs.rmSync(sentinel, { force: true });
    }
  });

  test('--global writes under the provided home and --target writes to that directory', () => {
    const cwd = tempDir('tsd-global-cwd-');
    const globalHome = tempDir('tsd-global-home-');
    const globalResult = run(['install', '--global'], cwd, globalHome);
    assert.equal(globalResult.status, 0, globalResult.stderr);
    const globalDest = path.join(globalHome, '.agents', 'skills', SKILL_NAME);
    assertSkillTree(globalDest);
    assert.equal(fs.existsSync(path.join(globalHome, '.claude')), false);
    assert.equal(fs.existsSync(path.join(cwd, '.claude')), false);
    assert.match(globalResult.stdout, /Claude Code docs do not list this path/);
    const explicit = path.join(tempDir('tsd-target-'), 'nested', 'skill');
    const target = run(['install', '--target', explicit], cwd, home);
    assert.equal(target.status, 0, target.stderr);
    assertSkillTree(explicit);
    const relativeBase = tempDir('tsd-rel-base-');
    const relativeOut = path.join(path.dirname(relativeBase), 'tsd-rel-out-' + path.basename(relativeBase));
    reserved(relativeOut);
    fs.mkdirSync(relativeOut);
    const escaped = run(['install', '--target', path.join('..', path.basename(relativeOut), 'skill')], relativeBase, home);
    assert.equal(escaped.status, 0, escaped.stderr);
    assert.ok(fs.existsSync(path.join(relativeOut, 'skill', 'SKILL.md')));
    assert.equal(fs.existsSync(path.join(relativeBase, 'skill')), false);
    const empty = tempDir('tsd-empty-');
    const intoEmpty = run(['install', '--target', '.'], empty, home);
    assert.equal(intoEmpty.status, 0, intoEmpty.stderr);
    assert.ok(fs.existsSync(path.join(empty, 'SKILL.md')));
  });

  test('existing foreign directories and non-directories are refused even with --force', () => {
    const cwd = tempDir('tsd-foreign-cwd-');
    const foreign = path.join(tempDir('tsd-foreign-'), 'dir');
    fs.mkdirSync(foreign);
    fs.writeFileSync(path.join(foreign, 'keep.txt'), 'keep');
    expectFail(run(['install', '--target', foreign], cwd, home), /not an installed three-scene-debugger skill/);
    expectFail(run(['install', '--target', foreign, '--force'], cwd, home), /not an installed three-scene-debugger skill/);
    assert.equal(fs.readFileSync(path.join(foreign, 'keep.txt'), 'utf8'), 'keep');
    assert.equal(fs.existsSync(path.join(foreign, 'SKILL.md')), false);
    const other = path.join(tempDir('tsd-other-skill-'), 'dir');
    fs.mkdirSync(other);
    fs.writeFileSync(path.join(other, 'SKILL.md'), '---\nname: other-skill\n---\n');
    fs.writeFileSync(path.join(other, 'keep.txt'), 'keep');
    expectFail(run(['install', '--target', other, '--force'], cwd, home), /not an installed three-scene-debugger skill/);
    assert.equal(fs.readFileSync(path.join(other, 'keep.txt'), 'utf8'), 'keep');
    const fileDest = path.join(tempDir('tsd-file-dest-'), 'file');
    fs.writeFileSync(fileDest, 'not a directory');
    expectFail(run(['install', '--target', fileDest, '--force'], cwd, home), /non-directory/);
    assert.equal(fs.readFileSync(fileDest, 'utf8'), 'not a directory');
    const savedExit = process.exitCode;
    try {
      assert.throws(() => main([process.execPath, cli, 'install', '--target', '\0hidden']), /Invalid/);
    } finally {
      process.exitCode = savedExit;
    }
    expectFail(run(['install', '--target', path.join('/etc', SKILL_NAME + '-cli-test')], cwd, home), /system directory/);
    assert.equal(fs.existsSync(path.join('/etc', SKILL_NAME + '-cli-test')), false);
  });

  test('an existing skill refuses drift until --force, which keeps unrelated files', () => {
    const cwd = tempDir('tsd-force-cwd-');
    const dest = path.join(tempDir('tsd-force-'), 'skill');
    assert.equal(run(['install', '--target', dest], cwd, home).status, 0);
    const changed = path.join(dest, 'references', 'troubleshooting.md');
    const original = fs.readFileSync(changed, 'utf8');
    fs.writeFileSync(changed, original + '\nlocal note\n');
    fs.writeFileSync(path.join(dest, 'user-notes.txt'), 'keep-me');
    const denied = run(['install', '--target', dest], cwd, home);
    expectFail(denied, /--force/);
    assert.ok(fs.readFileSync(changed, 'utf8').includes('local note'));
    const forced = run(['install', '--target', dest, '--force'], cwd, home);
    assert.equal(forced.status, 0, forced.stderr);
    assert.match(forced.stdout, /Updated/);
    assert.match(forced.stdout, /unrelated files were left in place/);
    assert.equal(fs.readFileSync(changed, 'utf8'), original);
    assert.equal(fs.readFileSync(path.join(dest, 'user-notes.txt'), 'utf8'), 'keep-me');
    const partial = path.join(tempDir('tsd-partial-'), 'skill');
    fs.mkdirSync(partial);
    fs.writeFileSync(path.join(partial, 'SKILL.md'), '---\nname: three-scene-debugger\n---\npartial\n');
    fs.writeFileSync(path.join(partial, 'notes.txt'), 'stay');
    expectFail(run(['install', '--target', partial], cwd, home), /--force/);
    assert.ok(fs.readFileSync(path.join(partial, 'SKILL.md'), 'utf8').includes('partial'));
    assert.equal(run(['install', '--target', partial, '--force'], cwd, home).status, 0);
    assert.ok(fs.existsSync(path.join(partial, 'scripts', 'three-scene-debugger.js')));
    assert.equal(fs.readFileSync(path.join(partial, 'notes.txt'), 'utf8'), 'stay');
    assert.doesNotMatch(fs.readFileSync(path.join(partial, 'SKILL.md'), 'utf8'), /^partial$/m);
  });

  test('symlink destinations, parents, and owned files are not followed or replaced', () => {
    const cwd = tempDir('tsd-link-cwd-');
    const outside = tempDir('tsd-link-outside-');
    fs.writeFileSync(path.join(outside, 'secret.txt'), 'do-not-touch');
    const realDir = path.join(outside, 'real');
    fs.mkdirSync(realDir);
    const linkDest = path.join(tempDir('tsd-link-dest-'), 'link');
    fs.symlinkSync(realDir, linkDest);
    expectFail(run(['install', '--target', linkDest, '--force'], cwd, home), /symlink/);
    assert.deepEqual(fs.readdirSync(realDir), []);
    const linkParent = path.join(tempDir('tsd-link-parent-'), 'parent');
    fs.symlinkSync(realDir, linkParent);
    expectFail(run(['install', '--target', path.join(linkParent, 'skill'), '--force'], cwd, home), /symlink/);
    assert.equal(fs.existsSync(path.join(realDir, 'skill')), false);
    const installed = path.join(tempDir('tsd-link-file-'), 'skill');
    assert.equal(run(['install', '--target', installed], cwd, home).status, 0);
    const owned = path.join(installed, 'references', 'integration.md');
    fs.unlinkSync(owned);
    fs.symlinkSync(path.join(outside, 'secret.txt'), owned);
    expectFail(run(['install', '--target', installed, '--force'], cwd, home), /symlink|non-regular/);
    assert.equal(fs.readFileSync(path.join(outside, 'secret.txt'), 'utf8'), 'do-not-touch');
    assert.equal(fs.lstatSync(owned).isSymbolicLink(), true);
    const scripts = path.join(installed, 'scripts');
    fs.rmSync(scripts, { recursive: true, force: true });
    fs.symlinkSync(outside, scripts);
    expectFail(run(['install', '--target', installed, '--force'], cwd, home), /symlink/);
    assert.equal(fs.existsSync(path.join(outside, 'three-scene-debugger.js')), false);
    assert.equal(fs.readFileSync(path.join(outside, 'secret.txt'), 'utf8'), 'do-not-touch');
  });

  test('install from the repository does not rewrite the package source', () => {
    const project = tempDir('tsd-repo-copy-');
    const agentsDir = path.join(repo, '.agents');
    cleanup.push(agentsDir);
    fs.rmSync(agentsDir, { recursive: true, force: true });
    // Use the real repository as cwd. The destination is inside it and gitignored.
    const result = run(['install'], repo, home);
    assert.equal(result.status, 0, result.stderr);
    const dest = path.join(repo, '.agents', 'skills', SKILL_NAME);
    assert.equal(fs.existsSync(path.join(repo, '.claude')), false);
    assertSkillTree(dest);
    assert.equal(sha(path.join(repo, 'scripts', 'three-scene-debugger.js')), coreBefore);
    expectFail(run(['install', '--target', repo], project, home), /package directory itself/);
    assert.equal(sha(path.join(repo, 'scripts', 'three-scene-debugger.js')), coreBefore);
  });

  test('each documented agent maps to its own project and global directory', () => {
    const cwd = tempDir('tsd-agents-');
    const globalHome = tempDir('tsd-agents-home-');
    const list = run(['--list-agents'], cwd, globalHome);
    assert.equal(list.status, 0, list.stderr);
    assert.equal(fs.existsSync(path.join(cwd, '.agents')), false);
    for (const agent of AGENTS) {
      assert.match(list.stdout, new RegExp('^' + agent.id + '\\t', 'm'));
      assert.ok(list.stdout.includes(agent.source), agent.source);
      const project = run(['install', '--agent', agent.id], cwd, globalHome);
      assert.equal(project.status, 0, agent.id + '\n' + project.stderr + project.stdout);
      assertSkillTree(path.join(cwd, ...agent.project, SKILL_NAME));
      const globalResult = run(['install', '--global', '--agent', agent.id], cwd, globalHome);
      assert.equal(globalResult.status, 0, agent.id + '\n' + globalResult.stderr + globalResult.stdout);
      assertSkillTree(path.join(globalHome, ...agent.global, SKILL_NAME));
    }
    assert.equal(fs.existsSync(path.join(globalHome, '.claude', 'skills', SKILL_NAME)), true);
    assert.equal(fs.existsSync(path.join(cwd, '.codex')), false);
    const neutral = path.join(cwd, '.agents', 'skills', SKILL_NAME);
    assert.equal(fs.existsSync(neutral), true);
    const ignored = run(['install', '--list-agents'], cwd, globalHome);
    assert.equal(ignored.status, 0, ignored.stderr);
    const before = fs.statSync(path.join(neutral, 'SKILL.md')).mtimeMs;
    const noWrite = run(['install', '--list-agents'], cwd, globalHome);
    assert.equal(noWrite.status, 0);
    assert.equal(fs.statSync(path.join(neutral, 'SKILL.md')).mtimeMs, before);
  });

  test('duplicate agents install once, unknown agents write nothing, and non-TTY does not prompt', () => {
    const cwd = tempDir('tsd-dup-');
    const globalHome = tempDir('tsd-dup-home-');
    const repeated = run(['install', '--agent', 'cursor', '--agent', 'cursor'], cwd, globalHome);
    assert.equal(repeated.status, 0, repeated.stderr);
    assert.equal((repeated.stdout.match(/Installed /g) || []).length, 1);
    const comma = run(['install', '--agent', 'cursor,cursor,claude-code'], cwd, globalHome);
    assert.equal(comma.status, 0, comma.stderr);
    assertSkillTree(path.join(cwd, '.cursor', 'skills', SKILL_NAME));
    assertSkillTree(path.join(cwd, '.claude', 'skills', SKILL_NAME));
    assert.equal(fs.existsSync(path.join(cwd, '.agents', 'skills', SKILL_NAME)), false);
    const shared = run(['install', '--agent', 'codex', '--agent', 'agents'], cwd, globalHome);
    assert.equal(shared.status, 0, shared.stderr);
    assert.equal((shared.stdout.match(/Installed /g) || []).length, 1);
    assertSkillTree(path.join(cwd, '.agents', 'skills', SKILL_NAME));
    assert.equal(fs.existsSync(path.join(cwd, '.codex')), false);
    const empty = tempDir('tsd-unknown-');
    expectFail(run(['install', '--agent', 'not-a-real-agent'], empty, globalHome), /Unknown agent/);
    assert.deepEqual(fs.readdirSync(empty), []);
    expectFail(run(['install', '--agent', 'cursor', '--target', path.join(empty, 'custom')], empty, globalHome), /--target alone/);
    assert.deepEqual(fs.readdirSync(empty), []);
    assert.throws(
      () => resolvePlans(
        { target: null, global: true, agents: ['no-global'] },
        [{ id: 'no-global', name: 'No Global', project: ['.no-global', 'skills'], global: null }]
      ),
      /no documented global/
    );
    const quiet = tempDir('tsd-tty-');
    const piped = spawnSync(process.execPath, [cli, 'install'], {
      cwd: quiet,
      env: Object.assign({}, process.env, { HOME: globalHome, USERPROFILE: globalHome }),
      encoding: 'utf8',
      timeout: 8000,
      input: '',
      stdio: ['pipe', 'pipe', 'pipe']
    });
    assert.equal(piped.status, 0, piped.stdout + '\n' + piped.stderr);
    assert.equal(piped.error, undefined);
    assertSkillTree(path.join(quiet, '.agents', 'skills', SKILL_NAME));
    assert.equal(fs.existsSync(path.join(quiet, '.claude')), false);
    const blocked = tempDir('tsd-atomic-');
    fs.mkdirSync(path.join(blocked, '.claude', 'skills', SKILL_NAME), { recursive: true });
    fs.writeFileSync(path.join(blocked, '.claude', 'skills', SKILL_NAME, 'keep.txt'), 'keep');
    expectFail(run(['install', '--agent', 'claude-code', '--agent', 'opencode', '--force'], blocked, globalHome), /not an installed three-scene-debugger skill/);
    assert.equal(fs.existsSync(path.join(blocked, '.opencode')), false);
    assert.equal(fs.readFileSync(path.join(blocked, '.claude', 'skills', SKILL_NAME, 'keep.txt'), 'utf8'), 'keep');
  });

  test('npm pack tarball installs through real npx and stays idempotent', () => {
    const packDir = tempDir('tsd-pack-');
    const cacheDir = tempDir('tsd-npm-cache-');
    const packed = spawnSync('npm', ['pack', '--json', '--pack-destination', packDir], {
      cwd: repo,
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
      env: Object.assign({}, process.env, {
        npm_config_update_notifier: 'false',
        npm_config_fund: 'false',
        npm_config_audit: 'false'
      })
    });
    assert.equal(packed.status, 0, packed.stdout + packed.stderr);
    const jsonStart = packed.stdout.indexOf('[');
    assert.ok(jsonStart >= 0, packed.stdout);
    const listed = JSON.parse(packed.stdout.slice(jsonStart));
    const names = listed[0].files.map((file) => file.path);
    for (const rel of ['SKILL.md', 'bin/three-scene-debugger.js', 'dist/three-scene-debugger.mjs', 'dist/three-scene-debugger.js', 'scripts/three-scene-debugger.js', 'references/integration.md', 'tests/runtime.cjs', 'tests/browser.cjs', 'tests/cli.cjs']) {
      assert.ok(names.includes(rel), 'tarball missing ' + rel);
    }
    assert.equal(names.some((name) => name === 'node_modules' || name.startsWith('node_modules/')), false);
    const tgzName = fs.readdirSync(packDir).find((name) => name.endsWith('.tgz'));
    assert.ok(tgzName);
    const tgz = path.join(packDir, tgzName);
    const listing = spawnSync('tar', ['-tzf', tgz], { encoding: 'utf8' });
    assert.equal(listing.status, 0, listing.stderr);
    assert.equal(listing.stdout.includes('node_modules'), false);
    const packedPackage = spawnSync('tar', ['-xOzf', tgz, 'package/package.json'], { encoding: 'utf8' });
    const packedJson = JSON.parse(packedPackage.stdout);
    assert.equal(packedJson.dependencies, undefined);
    assert.equal(packedJson.peerDependencies.three, '>=0.160.0 <1');
    assert.equal(packedJson.bin[SKILL_NAME], './bin/three-scene-debugger.js');
    const project = tempDir('tsd-npx-project-');
    const target = path.join(tempDir('tsd-npx-target-'), 'skill');
    const npxEnv = Object.assign({}, process.env, {
      HOME: home,
      USERPROFILE: home,
      npm_config_cache: cacheDir,
      npm_config_update_notifier: 'false',
      npm_config_fund: 'false',
      npm_config_audit: 'false'
    });
    const version = spawnSync('npx', ['--yes', '--package=' + tgz, SKILL_NAME, '--version'], {
      cwd: project,
      env: npxEnv,
      encoding: 'utf8',
      timeout: 180000,
      maxBuffer: 10 * 1024 * 1024
    });
    assert.equal(version.status, 0, version.stdout + version.stderr);
    assert.equal(version.stdout.trim(), SKILL_NAME + ' ' + pkg.version);
    const installed = spawnSync('npx', ['--yes', '--package=' + tgz, SKILL_NAME, 'install', '--target', target], {
      cwd: project,
      env: npxEnv,
      encoding: 'utf8',
      timeout: 180000,
      maxBuffer: 10 * 1024 * 1024
    });
    assert.equal(installed.status, 0, installed.stdout + installed.stderr);
    assert.match(installed.stdout, /Installed three-scene-debugger/);
    assertSkillTree(target);
    assert.equal(fs.existsSync(path.join(target, 'node_modules')), false);
    const marker = fs.statSync(path.join(target, 'dist', 'three-scene-debugger.mjs'));
    const second = spawnSync('npx', ['--yes', '--package=' + tgz, SKILL_NAME, 'install', '--target', target], {
      cwd: project,
      env: npxEnv,
      encoding: 'utf8',
      timeout: 180000,
      maxBuffer: 10 * 1024 * 1024
    });
    assert.equal(second.status, 0, second.stdout + second.stderr);
    assert.match(second.stdout, /unchanged/);
    assert.equal(fs.statSync(path.join(target, 'dist', 'three-scene-debugger.mjs')).mtimeMs, marker.mtimeMs);
    assert.equal(sha(path.join(repo, 'dist', 'three-scene-debugger.mjs')), esmBefore);
    assert.equal(sha(path.join(repo, 'scripts', 'three-scene-debugger.js')), coreBefore);
  });

  console.log(JSON.stringify({
    passed: passed,
    node: process.version,
    package: pkg.version,
    webgl: 'NOT TESTED',
    visual: 'NOT TESTED',
    installer: 'file copy only'
  }));
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  fs.rmSync(path.join(repo, '.cli-test-sentinel'), { force: true });
  for (const dir of cleanup) fs.rmSync(dir, { recursive: true, force: true });
}
