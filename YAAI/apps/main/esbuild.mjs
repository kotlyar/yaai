import { build } from 'esbuild'; // eslint-disable-line import/no-unresolved
import { minifyCssLiterals } from './modules/utils/build.mjs';

const appdir = 'apps/main';
const outdir = `builds/${appdir}`;

const options = {
  entryPoints: [
    `${appdir}/public/scripts/app.mjs`,
    `${appdir}/public/scripts/out.mjs`,
  ],
  minify: true,
  bundle: true,
  outdir,
  outExtension: {
    '.js': '.mjs',
  },
  plugins: [minifyCssLiterals(outdir)],
  target: 'es2022',
};

build(options).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});