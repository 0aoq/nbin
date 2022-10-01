/**
 * @file Subreddit header component
 * @name SubredditHeader.js
 * @license MIT
 */

import Component from "./Component.js";

/**
 * @type SubredditHeaderData
 */
export type SubredditHeaderData = {
    title: string;
};

/**
 * @class Post
 */
export default class SubredditHeader extends Component {
    data: SubredditHeaderData;

    /**
     * @param {SubredditHeaderData} Post.data
     * @param {HTMLElement} Post.parent
     */
    constructor(data: SubredditHeaderData, parent: HTMLElement) {
        // inherit properties
        super(parent);

        // element specific properties
        this.data = data;

        // fill content
        this.element.classList.add("nbin.core.subreddit.header");
        this.element.innerHTML = `<h1>${data.title}</h1>`;
    }
}
