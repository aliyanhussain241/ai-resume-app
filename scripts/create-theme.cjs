const AdmZip = require('adm-zip');
const zip = new AdmZip();

const styleCss = `/*
Theme Name: ResuBeat
Theme URI: https://ais-pre-x2qihy6cpquhygiukgmts5-458304802800.asia-east1.run.app
Author: ResuBeat
Description: Full-screen theme for ResuBeat AI Resume Builder.
Version: 1.0.0
*/
body {
    margin: 0;
    padding: 0;
    overflow: hidden;
}
iframe {
    width: 100vw;
    height: 100vh;
    border: none;
}
`;

const indexPhp = `<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        iframe { width: 100vw; height: 100vh; border: none; display: block; }
    </style>
</head>
<body <?php body_class(); ?>>
    <iframe src="https://ais-pre-x2qihy6cpquhygiukgmts5-458304802800.asia-east1.run.app" title="ResuBeat" allowfullscreen></iframe>
    <?php wp_footer(); ?>
</body>
</html>
`;

zip.addFile("resubeat-theme/style.css", Buffer.from(styleCss, "utf8"));
zip.addFile("resubeat-theme/index.php", Buffer.from(indexPhp, "utf8"));
zip.writeZip(__dirname + '/../public/resubeat-theme.zip');
console.log("Theme Zip file created.");
