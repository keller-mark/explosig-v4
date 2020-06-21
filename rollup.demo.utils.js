function htmlFromTemplate({ title, publicPath, cssFile, jsFile }) {
    return `<!DOCTYPE html>
<html>
    <head lang="en">
        <title>${title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href="${publicPath}${cssFile}"/>
        <style>
            body {
                height: 100vh;
            }
        </style>
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>        
        <script type="text/javascript" src="${publicPath}${jsFile}"></script>
    </body>
</html>`;
};

module.exports = {
    htmlFromTemplate,
};