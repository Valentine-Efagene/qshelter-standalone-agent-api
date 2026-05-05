const esbuild = require('esbuild');
const { esbuildDecorators } = require('@anatine/esbuild-decorators');
const path = require('path');

const isLocal = process.env.SLS_STAGE === 'local' || process.env.NODE_ENV === 'development';
const tsconfigPath = path.resolve(__dirname, '../tsconfig.build.json');

esbuild.build({
    entryPoints: [path.resolve(__dirname, '../src/serverless.ts')],
    bundle: true,
    platform: 'node',
    target: 'node20',
    outfile: path.resolve(__dirname, '../dist/serverless.js'),
    format: 'cjs',
    // Bundle all dependencies into the output — eliminates node_modules from the Lambda zip.
    // Mark only optional NestJS peer deps (not installed) and native addons as external.
    external: [
        // Optional NestJS features not used by this app
        '@nestjs/microservices',
        '@nestjs/microservices/microservices-module',
        '@nestjs/websockets/socket-module',
        // class-transformer lazy sub-path
        'class-transformer/storage',
        // mysql2 optional native binding
        'mysql2/lib/bindings',
    ],
    plugins: [
        esbuildDecorators({ tsconfig: tsconfigPath }),
    ],
    minify: !isLocal,
    sourcemap: isLocal ? 'inline' : false,
    tsconfig: tsconfigPath,
    logLevel: 'info',
}).catch(() => process.exit(1));
