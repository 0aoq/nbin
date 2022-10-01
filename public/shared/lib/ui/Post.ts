/**
 * @file Post component
 * @name Post.js
 * @license MIT
 */

import Component from "./Component.js";

/**
 * @type PostData
 */
export type PostData = {
    title: string;
    blurb: string;
    link?: string;
    extra?: string;
};

/**
 * @class Post
 */
export default class Post extends Component {
    data: PostData;

    /**
     * @param {PostData} Post.data
     * @param {HTMLElement} Post.parent
     */
    constructor(data: PostData, parent: HTMLElement) {
        // inherit properties
        super(parent);

        // element specific properties
        this.data = data;

        // fill content
        this.element.classList.add("nbin.core.post");
        this.element.innerHTML = `<div><h2><${
            data.link !== undefined ? "a" : "span"
        } ${
            data.link !== undefined ? `href="${data.link}"` : ""
        } class="post.title">${data.title}</${
            data.link !== undefined ? "a" : "span"
        }></h2>

        <p>${(
            (window as any).marked || {
                parse: (s: string) => {
                    return s;
                },
            }
        ).parse(data.blurb)}</p></div>
        ${data.extra || ""}`;

        if (data.link) {
            this.element.addEventListener("click", () => {
                window.location.href = data.link as string;
            });
        } else {
            this.element.style.cursor = "initial";
        }
    }
}
