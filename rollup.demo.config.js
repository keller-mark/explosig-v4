const pkg = require('./package.json');
const { join } = require('path');
const merge = require('lodash/merge');

const resolve = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const scss = require('rollup-plugin-scss');
const svgr = require('@svgr/rollup').default;
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const replace = require('@rollup/plugin-replace');
const html = require('@rollup/plugin-html');
const visualizer = require('rollup-plugin-visualizer');
const { terser } = require('rollup-plugin-terser');

const { htmlFromTemplate } = require('./rollup.demo.utils');

// Imports for namedExports
const react = require('react');
const reactIs = require('react-is');
const reactDom = require('react-dom');

// Constants for output files:
const SRC_DIR = 'src';
const BUILD_DIR = 'build-demo';
const OUTPUT_JS = {
    'production': 'index.min.js',
    'development': 'index.js',
};
const OUTPUT_CSS = 'index.css';
const OUTPUT_HTML = 'index.html';

// Only import dev server if necessary:
let serve = (() => {});
let livereload = (() => {});
if(process.env.NODE_ENV === 'development') {
    serve = require('rollup-plugin-serve');
    livereload = require('rollup-plugin-livereload');
}

// The base rollup configuration. To be merged with dev or prod object.
const baseConfig = {
    input: join(SRC_DIR, 'explosig', 'index.js'),
    output: {
        file: join(BUILD_DIR, OUTPUT_JS[process.env.NODE_ENV]),
        sourcemap: true,
    },
    plugins: [
        resolve({
            browser: true,
        }),
        scss({
            output: join(BUILD_DIR, OUTPUT_CSS),
        }),
        svgr(),
        json(),
        commonjs({
            include: /node_modules/,
            exclude: [
                // The following are to fix [!] Error: 'import' and 'export' may only appear at the top level.
                // Reference: https://github.com/rollup/plugins/issues/304
                'node_modules/symbol-observable/es/index.js',
            ],
            namedExports: {
                'node_modules/react/index.js': Object.keys(react),
                'node_modules/react-is/index.js': Object.keys(reactIs),
                'node_modules/react-dom/index.js': Object.keys(reactDom),
            }
        }),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
        replace({
            // React uses process.env to determine whether a development or production environment.
            // Reference: https://github.com/rollup/rollup/issues/487#issuecomment-177596512
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        html({
            title: pkg.name,
            publicPath: '/',
            fileName: OUTPUT_HTML,
            template: ({ publicPath, title }) => {
                return htmlFromTemplate({
                    publicPath: (process.env.NODE_ENV === 'production' ? publicPath : './'),
                    title: title,
                    cssFile: OUTPUT_CSS,
                    jsFile: OUTPUT_JS[process.env.NODE_ENV],
                });
            }
        })
    ]
};

const devConfig = {
    output: {
        format: 'umd',
    },
    plugins: [
        ...baseConfig.plugins.map(() => {}),
        visualizer({
            filename: join(BUILD_DIR, 'stats.html')
        }),
        serve({
            port: 8000,
            contentBase: BUILD_DIR
        }),
        livereload(BUILD_DIR)
    ]
};

const prodConfig = {
    output: {
        format: 'iife',
        plugins: [
            terser()
        ],
    }
};

export default merge(
    (process.env.NODE_ENV === 'development' ? devConfig : prodConfig), 
    baseConfig
);