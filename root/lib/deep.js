function getElementByIdDeep(id, root = document) {
    const el = root.getElementById?.(id) ?? root.querySelector?.(`#${CSS.escape(id)}`);
    if (el) return el;

    const elements = root.querySelectorAll?.("*") ?? [];

    for (const element of elements) {
        if (element.shadowRoot) {
            const found = getElementByIdDeep(id, element.shadowRoot);
            if (found) return found;
        }
    }
    return null;
}

function querySelectorDeep(selector, root = document) {
    const el = root.querySelector?.(selector);
    if (el) return el;

    const elements = root.querySelectorAll?.("*") ?? [];
    for (const element of elements) {
        if (element.shadowRoot) {
            const found = querySelectorDeep(selector, element.shadowRoot);
            if (found) return found;
        }
    }
    return null;
}

function querySelectorAllDeep(selector, root = document) {
    let results = [];
    results.push(...root.querySelectorAll?.(selector) ?? []);

    const elements = root.querySelectorAll?.("*") ?? [];
    for (const element of elements) {
        if (element.shadowRoot) {
            results.push(...querySelectorAllDeep(selector, element.shadowRoot));
        }
    }
    return results;
}

function deepElementFromPointObsolete(root, x, y) {
    const el = root.elementFromPoint(x, y);
    if (el) return el;

    if (el && el.shadowRoot) {
        const inner = deepElementFromPointObsolete(el.shadowRoot, x, y);
        return inner || el;
    }
    return el;
}

function deepElementFromPoint(root, x, y) {
    const el = root.elementFromPoint(x, y);

    if (!el) {
        return null;
    }

    if (el.shadowRoot) {
        return deepElementFromPoint(
            el.shadowRoot,
            x,
            y
        ) ?? el;
    }

    return el;
}

function closestDeep(element, selector) {
    while (element) {
        if (element.matches?.(selector)) return element;
        if (element.parentElement) {
            element = element.parentElement;
        } else {
            const root = element.getRootNode();
            element = root instanceof ShadowRoot ? root.host : null;
        }
    }
    return null;
}