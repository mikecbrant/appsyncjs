import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { generate } from './lib/generate.mjs';

export async function create({ templateDir, dest }) {
  const ctx = await buildContext({ templateDir, dest });
  await generate(ctx);
}

async function buildContext({ templateDir, dest }) {
  const appName = path.basename(dest).replace(/[^a-zA-Z0-9-_]/g, '-');
  // Pull current versions of internal packages from this repo's package.json files at publish-time.
  // At runtime (consumer env), these values are baked into the template placeholders.
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(__dirname, '../../');
  const readJSON = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));
  let dynamoVersion = '^0.3.0';
  let testUtilsVersion = '^1.2.4';
  try {
    const dyn = await readJSON(path.resolve(repoRoot, 'packages/dynamo/package.json'));
    dynamoVersion = `^${dyn.version}`;
  } catch {}
  try {
    const tu = await readJSON(path.resolve(repoRoot, 'packages/test-utils/package.json'));
    testUtilsVersion = `^${tu.version}`;
  } catch {}

  return {
    templateDir,
    dest,
    vars: {
      APP_NAME: appName,
      REGION: 'us-east-1',
      USER_TABLE_NAME: 'Users',
      DYNAMO_VERSION: dynamoVersion,
      TEST_UTILS_VERSION: testUtilsVersion,
    },
  };
}

export default { create };
