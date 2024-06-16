const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');

function copyJsonFiles(src, dest) {
    const items = fs.readdirSync(src);
    let hasJsonFiles = false;

    items.forEach(item => {
        const srcItem = path.join(src, item);
        const destItem = path.join(dest, item);

        if (fs.statSync(srcItem).isDirectory()) {
            if (copyJsonFiles(srcItem, destItem)) {
                if (!fs.existsSync(dest)) {
                    fs.mkdirSync(dest);
                }

                hasJsonFiles = true;
            }
        } 
        
        if (path.extname(item) === '.json') {
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest);
            }

            fs.copyFileSync(srcItem, destItem);

            console.log(`Copied ${item} to ${dest}`);
            hasJsonFiles = true;
        }
    });

    return hasJsonFiles;
}

esbuild.build({
    entryPoints: ['./src/app.ts'],
    platform: 'node',
    bundle: true,
    minify: true,
    outfile: 'dist/app.js',
    external: ['src/locales/*.json']
})
.then(() => copyJsonFiles("./src", "./dist"))
.catch((err) => {
    console.log(err);
    process.exit(1);
});