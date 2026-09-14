import { BaseComponent } from "/components/base-component.js";

const pageDefaults = {};
const popupDefaults = {};

window.Lattice = {
    BaseComponent,

    components: new Map(),

    async define(name, path) {
        if (customElements.get(name)) {
            return customElements.get(name);
        }

        const response = await fetch(path);

        if (!response.ok) {
            throw new Error(
                `Failed to load component "${name}" from "${path}".`
            );
        }

        const source = await response.text();

        const definition = this.parse(source);
        const behavior = this.parseBehavior(definition.script);

        const Base = this.BaseComponent;

        class Component extends Base {
            mount() {
                this.renderDefinition(definition);
                this.__onConnected?.();
            }

            unmount() {
                this.__onDisconnected?.();
            }
        }

        if (behavior) {
            for (const [key, value] of Object.entries(behavior)) {
                if (typeof value !== "function") {
                    continue;
                }

                if (key === "connectedCallback") {
                    Component.prototype.__onConnected = value;
                    continue;
                }

                if (key === "disconnectedCallback") {
                    Component.prototype.__onDisconnected = value;
                    continue;
                }

                Component.prototype[key] = value;
            }
        }

        customElements.define(name, Component);

        this.components.set(name, {
            url: path,
            definition,
            constructor: Component
        });

        return Component;
    },

    parse(source) {
        const template = document.createElement("template");
        template.innerHTML = source;

        const style = template.content.querySelector("style");
        const script = template.content.querySelector("script");

        const css = style?.textContent ?? "";
        const js = script?.textContent ?? "";

        style?.remove();
        script?.remove();

        return {
            style: css,
            script: js,
            html: template.innerHTML
        };
    },

    parseBehavior(source) {
        if (!source || !source.trim()) {
            return null;
        }

        const code = source.trim();

        try {
            return new Function(`return ({${code}});`)();
        } catch (objectLiteralError) {
            try {
                const TempBehavior = new Function(
                    `return class LatticeBehavior {${code}};`
                )();

                const behavior = {};
                const methodNames = Object
                    .getOwnPropertyNames(TempBehavior.prototype)
                    .filter(name => name !== "constructor");

                for (const methodName of methodNames) {
                    behavior[methodName] = TempBehavior.prototype[methodName];
                }

                return behavior;
            } catch (classBodyError) {
                console.error("Failed to parse component script.", {
                    objectLiteralError,
                    classBodyError,
                    source: code
                });
                throw classBodyError;
            }
        }
    },

    get(name) {
        return this.components.get(name);
    },

    has(name) {
        return this.components.has(name);
    },

    transitionPage(id) {
        for (const pageId in pageDefaults) {
            const el = getElementByIdDeep(pageId);
            if (!el) continue;
            if (pageId === id) {
                el.style.display = pageDefaults[pageId].display ?? "block";
                el.getRootNode().host.style.display = 'block';
            } else {
                el.style.display = "none";
                el.getRootNode().host.style.display = 'none';
            }
        }
    },

    openPopup(id, layer) {
        const displayType = popupDefaults[id] || "block";
        let target = getElementByIdDeep(id);
        target.style.opacity = 1.0;
        target.style.display = displayType;
        target.getRootNode().host.style.display = 'block';
        if (layer === 1) {
            if (id !== "message") {
                document.getElementById('primary-cloud').style.display = 'block';
            }
        } else if (layer === 2) {
            //document.getElementById('secondary-cloud').style.display = 'block';
            target.style["z-index"] = 2001;
        }
    }
};

window.transitionPage = function (id) {
    return window.Lattice.transitionPage(id);
};

window.openPopup = function (id, layer) {
    return window.Lattice.openPopup(id, layer);
};