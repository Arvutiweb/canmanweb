import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const MAX_TEMP_BYTES = 6_000_000_000;

function directorySize(directory) {
  let total = 0;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      total += directorySize(entryPath);
    } else if (entry.isFile()) {
      total += fs.statSync(entryPath).size;
    }
  }
  return total;
}

export function createTemporaryDirectory(prefix, reserveBytes = 0) {
  const defaultRoot = process.platform === 'win32'
    ? 'R:\\canman_react_temp'
    : os.tmpdir();
  const root = path.resolve(process.env.CANMAN_TEMP_DIR || defaultRoot);

  fs.mkdirSync(root, { recursive: true });
  const usedBytes = directorySize(root);
  if (usedBytes + reserveBytes > MAX_TEMP_BYTES) {
    throw new Error(
      `Temporary-work limit exceeded: ${usedBytes} bytes already used and ${reserveBytes} bytes requested; limit is ${MAX_TEMP_BYTES} bytes at ${root}`
    );
  }
  return fs.mkdtempSync(path.join(root, prefix));
}
