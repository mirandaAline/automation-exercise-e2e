import { mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
execFileSync('git', ['archive', '--format=zip', '--prefix=automation-exercise-e2e/',
  '--output=dist/automation-exercise-e2e.zip', 'HEAD'], { cwd: root, stdio: 'inherit' });
console.log('ZIP criado em dist/automation-exercise-e2e.zip a partir do último commit.');
