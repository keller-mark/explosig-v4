module.exports = {
    env: {
        test: {
            presets: [
                ["@babel/preset-env", { modules: "commonjs" }],
                "@babel/preset-react"
            ],
            plugins: [
                "@babel/plugin-proposal-class-properties"
            ]
        },
        production: {
            presets: [
                ["@babel/preset-env", { modules: false }],
                "@babel/preset-react"
            ],
            plugins: [
                "@babel/plugin-proposal-class-properties"
            ]
        },
        development: {
            presets: [
                ["@babel/preset-env", { modules: false }],
                "@babel/preset-react"
            ],
            plugins: [
                "@babel/plugin-proposal-class-properties"
            ]
        }
    }
};