/*
MathJax = {
    tex: { inlineMath: [['\\(', '\\)'], ['\\[', '\\]']] },
    loader: { load: ['output/svg'] },
    svg: { fontCache: 'global' }
}
<script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
*/

function updateFormula(id) {
    (async () => {
        try {
            const el = getElementByIdDeep(id);
            await MathJax.typesetPromise([el]);
        } catch (e) {
            console.error(e);
        }
    })().then(() => {
        const shadow = getElementByIdDeep(id).getRootNode();
        const mjxStyle = document.getElementById("MJX-SVG-styles");
        const mjxCache = document.getElementById("MJX-SVG-global-cache");
        shadow.appendChild(mjxStyle.cloneNode(true));
        shadow.appendChild(mjxCache.cloneNode(true));
    })
}