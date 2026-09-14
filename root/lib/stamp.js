window.stamp = function(svg, surName, firstName, date) {
    const svgNS = "http://www.w3.org/2000/svg";
    const doc = svg.ownerDocument;

    svg.replaceChildren();

    svg.style.margin = "0px";
    svg.style.padding = "0px";
    svg.setAttribute("height", "100%");
    svg.setAttribute("width", "100%");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("xmlns", svgNS);

    const defs = doc.createElementNS(svgNS, "defs");
    const clipPath = doc.createElementNS(svgNS, "clipPath");
    clipPath.setAttribute("id", "outerline");
    const clipCircle = doc.createElementNS(svgNS, "circle");
    clipCircle.setAttribute("cx", "50");
    clipCircle.setAttribute("cy", "50");
    clipCircle.setAttribute("r", "47");
    clipPath.appendChild(clipCircle);
    defs.appendChild(clipPath);
    svg.appendChild(defs);

    const rect = doc.createElementNS(svgNS, "rect");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", "white");
    svg.appendChild(rect);

    const gStamp = doc.createElementNS(svgNS, "g");
    gStamp.setAttribute("id", "stamp");
    gStamp.setAttribute("clip-path", "url(#outerline)");

    const stampCircle = doc.createElementNS(svgNS, "circle");
    stampCircle.setAttribute("cx", "50");
    stampCircle.setAttribute("cy", "50");
    stampCircle.setAttribute("r", "45");
    stampCircle.setAttribute("fill", "none");
    stampCircle.setAttribute("stroke", "crimson");
    stampCircle.setAttribute("stroke-width", "5");

    const path1 = doc.createElementNS(svgNS, "path");
    path1.setAttribute("stroke", "crimson");
    path1.setAttribute("stroke-width", "5");
    path1.setAttribute("d", "M0,35 L100,35");

    const path2 = doc.createElementNS(svgNS, "path");
    path2.setAttribute("stroke", "crimson");
    path2.setAttribute("stroke-width", "5");
    path2.setAttribute("d", "M0,65 L100,65");
    gStamp.appendChild(stampCircle);

    gStamp.appendChild(path1);
    gStamp.appendChild(path2);
    svg.appendChild(gStamp);

    const gTexts = doc.createElementNS(svgNS, "g");
    gTexts.setAttribute("id", "texts");

    function createText(x, y, width, fill, fontSize, textWidth, textAnchor, alignmentBaseline, content) {
        const text = doc.createElementNS(svgNS, "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("width", width);
        text.setAttribute("fill", fill);
        text.setAttribute("font-size", fontSize);
        text.setAttribute("text-anchor", textAnchor);
        text.setAttribute("alignment-baseline", alignmentBaseline);
        text.textContent = content;
        return text;
    }

    const text1 = createText("50", "24", "100", "crimson", "20", "60", "middle", "middle", surName);
    const text2 = createText("50", "50", "100", "crimson", "15", "60", "middle", "middle", date);
    const text3 = createText("50", "82", "100", "crimson", "20", "60", "middle", "middle", firstName);
    gTexts.appendChild(text1);
    gTexts.appendChild(text2);
    gTexts.appendChild(text3);
    svg.appendChild(gTexts);
}