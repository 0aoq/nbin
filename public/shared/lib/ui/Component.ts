/**
 * @file Base component
 * @name Component.js
 * @license MIT
 */

/**
 * @class Component
 */
export default class Component {
    element: HTMLElement
    parent: HTMLElement
    uid: string;

    /** @param {HTMLElement} parent */
    constructor(parent: HTMLElement) {
        this.element = document.createElement("div");

        this.parent = parent;
        this.uid = `u-${crypto.randomUUID()}`;
        this.element.classList.add(this.uid);

        parent.appendChild(this.element);

        this.element = document.querySelector(`.${this.uid}`)!;
    }
}
