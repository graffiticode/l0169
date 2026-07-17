// SPDX-License-Identifier: MIT
//
// Run a generator and install its stdout at <dest>, but only if the generator
// actually succeeded and produced usable output.
//
//   node tools/emit.js ./dist/lexicon.json node tools/build-lexicon.js
//
// This exists because `generator > dest` cannot fail safely: the shell truncates
// dest *before* the generator runs, so a crash leaves a 0-byte file behind, and
// the exit status belongs to the redirect rather than the generator. A stray
// character in lexicon.js once shipped an empty lexicon.json to production that
// way — served as HTTP 200, which read as "language offline" to every client.
//
// Output is buffered and written only after the generator exits clean, so dest
// keeps its last-known-good contents on failure. A dest ending in .json is
// parsed before being written, since an unparseable asset fails the same silent
// way an empty one does.
import { spawnSync } from "child_process";
import { mkdirSync, writeFileSync } from "fs";
import { dirname } from "path";

const [dest, command, ...args] = process.argv.slice(2);

if (!dest || !command) {
  console.error("emit: usage: node tools/emit.js <dest> <command> [args...]");
  process.exit(2);
}

const fail = (message) => {
  console.error(`emit: ${message}`);
  console.error(`emit: ${dest} left unchanged`);
  process.exit(1);
};

const result = spawnSync(command, args, {
  stdio: ["inherit", "pipe", "inherit"],
  maxBuffer: 64 * 1024 * 1024,
});

const shown = [command, ...args].join(" ");

if (result.error) {
  fail(`could not run \`${shown}\`: ${result.error.message}`);
}
if (result.signal) {
  fail(`\`${shown}\` was killed by ${result.signal}`);
}
if (result.status !== 0) {
  fail(`\`${shown}\` exited ${result.status}`);
}

const output = result.stdout.toString();
if (output.trim() === "") {
  fail(`\`${shown}\` exited 0 but wrote nothing to stdout`);
}
if (dest.endsWith(".json")) {
  try {
    JSON.parse(output);
  } catch (err) {
    fail(`\`${shown}\` did not produce valid JSON: ${err.message}`);
  }
}

mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, output);
console.log(`emit: wrote ${dest} (${output.length} bytes)`);
