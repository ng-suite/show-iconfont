const path = require('path');
const fs = require('fs');
const fontCarrier = require('font-carrier');

const fontName = 'rsuite-icon-font';
const cssPrefix = 'nsicon';
const fontPath = path.resolve(__dirname, `./font/${fontName}.ttf`);
const font = fontCarrier.transfer(fontPath);

const allGlyph = font.allGlyph();
const glyphs = serializeGlyphs(allGlyph);

initcss(glyphs);
inithtml(glyphs);


function serializeGlyphs(allGlyph) {
    const glyphs = Object.keys(allGlyph).map(key => allGlyph[key]);
    return glyphs.map(glyph => {
        const content = glyph.options.unicode.replace(/^&#x/, '\\').replace(/;$/, '').toLowerCase();
        const name = glyph.options.name;
        const className = `${cssPrefix}-${name}`;
        return {
            className,
            content,
            name
        };
    });
}

function initcss(glyphs) {
    const cssPath = path.resolve(__dirname, './font/nsicon.css');
    let content = `@font-face {
    font-family: '${cssPrefix}';
    font-display: fallback;
    src: url('./${fontName}.eot'); /* IE9*/
    src: url('./${fontName}.eot?#iefix') format('eot'),
            url('./${fontName}.ttf') format('truetype'),
            url('./${fontName}.woff') format('woff'),
            url('./${fontName}.svg#ng-suite-icon-font') format('svg');
    font-weight: normal;
    font-style: normal;
}
.${cssPrefix} {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: ${cssPrefix} !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    display: inline-block;
    text-transform: none;
    font-size: 14px;
    line-height: 1;
    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
    `;
    glyphs.forEach(glyph => {
        content += `
.${glyph.className}:before { content: "${glyph.content}"}
        `;
    });
    fs.writeFileSync(cssPath, content);

};

function inithtml(glyphs) {
    const cssPath = './font/nsicon.css';
    const template = String(fs.readFileSync(path.resolve(__dirname, './template.html')));
    let list = '';
    glyphs.forEach(glyph => {
        list += `<li>
            <i class="${cssPrefix} ${glyph.className}"></i>
            <span class="nsicon-class">
                <span class="ns-badge">${glyph.name}</span>
            </span>
        </li>
        `;
    });
    fs.writeFileSync(
        path.resolve(__dirname, './index.html'), 
        template.replace(/{{style}}/g, cssPath).replace(/{{list}}/g, list)
    );
}