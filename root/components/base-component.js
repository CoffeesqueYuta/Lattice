export class BaseComponent extends HTMLElement {
    static get sharedStylePaths() {
        return [
            "/static/style/common/common.css",
            "/static/style/common/frame.css",
            "/static/style/helpers/table.css",
            "/static/style/helpers/form.css"
        ];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.__listeners = [];
    }

    renderDefinition(definition) {
        const sharedStyleLinks = (this.constructor.sharedStylePaths || BaseComponent.sharedStylePaths)
            .map(path => `<link rel="stylesheet" href="${path}">`)
            .join("\n");

        this.shadowRoot.innerHTML = `
            ${sharedStyleLinks}
            <style>
                ${definition.style}
            </style>

            ${definition.html}
        `;
    }

    $(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    $$(selector) {
        return Array.from(this.shadowRoot.querySelectorAll(selector));
    }

    $deep(selector) {
        return querySelectorDeep(
            selector,
            this.shadowRoot
        );
    }

    $$deep(selector) {
        return querySelectorAllDeep(
            selector,
            this.shadowRoot
        );
    }

    id(id) {
        return getElementByIdDeep(
            id,
            this.shadowRoot
        );
    }

    closestDeep(element, selector) {
        return closestDeep(
            element,
            selector
        );
    }


    emit(type, detail = null, options = {}) {
        const event = new CustomEvent(type, {
            detail,
            bubbles: options.bubbles ?? true,
            composed: options.composed ?? true,
            cancelable: options.cancelable ?? false
        });

        return this.dispatchEvent(event);
    }

    on(target, type, listener, options) {
        if (typeof target === "string") {
            target = this.$(target);
        }

        if (!target) {
            throw new Error(
                `Event target not found for "${type}".`
            );
        }

        target.addEventListener(
            type,
            listener,
            options
        );

        this.__listeners.push({
            target,
            type,
            listener,
            options
        });

        return this;
    }

    off(target, type, listener, options) {
        if (typeof target === "string") {
            target = this.$(target);
        }

        target?.removeEventListener(
            type,
            listener,
            options
        );

        this.__listeners = this.__listeners.filter(
            item =>
                item.target !== target ||
                item.type !== type ||
                item.listener !== listener
        );

        return this;
    }


    connectedCallback() {
        this.mount();
    }

    disconnectedCallback() {
        this.__removeAllListeners?.();
        this.unmount();
    }

    mount() {
        // override
    }

    unmount() {
        // override
    }


    __removeAllListeners() {
        for (const {
            target,
            type,
            listener,
            options
        } of this.__listeners) {

            target.removeEventListener(
                type,
                listener,
                options
            );
        }

        this.__listeners = [];
    }

}