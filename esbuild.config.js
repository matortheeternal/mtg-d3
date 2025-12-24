import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const config = {
    entryPoints: ['src/index.js'],
    bundle: true,
    sourcemap: true,
    outfile: 'public/index.js',
    format: 'esm',
    platform: 'browser'
};

if (isWatch) {
    const ctx = await esbuild.context(config);
    await ctx.watch();
    console.log('Watching for changes...');
} else {
    await esbuild.build(config).catch(() => process.exit(1));
    console.log('Build complete!');
}
