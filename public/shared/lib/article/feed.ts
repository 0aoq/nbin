/**
 * @file Handle feed
 * @name feed.js
 * @license MIT
 */

import { storedHash, searchParams } from "../core/page.js";
import endpoints from "../api/endpoints.js";

// import components
import SubredditHeader from "../ui/SubredditHeader.js";
import Post from "../ui/Post.js";

/**
 * @function renderPopular
 */
async function renderPopular() {
    // get popular for base feed
    const data = await (
        await fetch(endpoints.subreddit.where.popular())
    ).json();

    // show header
    new SubredditHeader(
        {
            title: "Popular",
        },
        document.getElementById("nbin.core.feed")!
    );

    // loop subs
    if (!data.data) return; // fetch failed!!
    for (let sub of data.data.children) {
        if (sub.kind !== "t5") continue; // not subreddit

        new Post(
            {
                title: sub.data.display_name_prefixed,
                blurb: sub.data.title,
                link: `?sub=${sub.data.display_name_prefixed}#subreddit/%`,
            },
            document.getElementById("nbin.core.feed")!
        );
    }
}

// check if we're on the feed page
const cint = setInterval(() => {
    if (storedHash === "feed/") {
        // clear interval
        clearInterval(cint);

        // render based on sort
        const sort = searchParams.get("sort");

        if (sort === "popular") renderPopular();
        else window.location.href = "/";
    }
}, 500);
