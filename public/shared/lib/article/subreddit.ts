/**
 * @file Handle subreddit view
 * @name subreddit.js
 * @license MIT
 */

import { storedHash, searchParams } from "../core/page.js";
import endpoints from "../api/endpoints.js";

// import components
import SubredditHeader from "../ui/SubredditHeader.js";
import Post from "../ui/Post.js";

/**
 * @function renderSub
 */
async function renderSub() {
    const sort = searchParams.get("sort") || "hot";
    const sub = searchParams.get("sub") || "/r/all";
    const subclient = endpoints.subreddit.sub(sub);

    document.title = `${sub} - ☕ NBIN`;

    // @ts-ignore
    if (!subclient[sort]) return;

    // render headers
    new SubredditHeader(
        {
            title: sub,
        },
        document.getElementById("nbin.core.subreddit")!
    );

    const subscribed_subs = JSON.parse(
        window.localStorage.getItem("subscribed_subs") as string
    );

    const subscribed = subscribed_subs.includes(sub);

    document.getElementById(
        "nbin.core.subreddit"
    )!.innerHTML += `<a class="btn" id="nbin.action.subscribe" style="width: 20rem;">
        ${subscribed ? "Unsubscribe" : "Subscribe"}
    </a>`;

    // handle subscribe
    setTimeout(() => {
        document
            .getElementById("nbin.action.subscribe")!
            .addEventListener("click", () => {
                const d = JSON.parse(
                    window.localStorage.getItem("subscribed_subs") as string
                );

                if (!subscribed) {
                    // subscribe
                    d.push(sub); // slice(1) to make it match the way subs are displayed in feed

                    window.localStorage.setItem(
                        "subscribed_subs",
                        JSON.stringify(d)
                    );
                } else {
                    // unsubscribe
                    d.splice(d.indexOf(sub), 1);

                    window.localStorage.setItem(
                        "subscribed_subs",
                        JSON.stringify(d)
                    );
                }

                window.location.reload();
            });
    }, 500); // wait for button to be added

    // function to load posts
    let lastPostId = ""; // will be used in the "before" section of the data to request more
    async function loadPosts(before: string | undefined) {
        // @ts-ignore
        const data = await (await fetch(subclient[sort](before))).json();

        // loop posts
        if (!data.data) return; // fetch failed!!
        for (let post of data.data.children) {
            if (post.kind !== "t3") continue; // not post
            lastPostId = post.data.name;

            const p = new Post(
                {
                    title: post.data.title,
                    blurb: post.data.url || "",
                    link: `?sub=${sub}&post=${post.data.id}#post/%`,
                    extra: `${
                        // render image
                        post.data.post_hint === "image"
                            ? `<div class="media">
                                <img src="${post.data.url}" 
                                style="--max: 10rem; max-width: var(--max); max-height: var(--max);" />
                            </div>`
                            : ""
                    }`,
                },
                document.getElementById("nbin.core.subreddit")!
            );

            // wait for link and add listener
            setTimeout(() => {
                document
                    .querySelector(`.${p.uid}`)!
                    .addEventListener("click", () => {
                        window.location.href = p.data.link as string;
                    });
            }, 200);
        }

        // show "Show More" button
        if (document.getElementById("nbin.action.showmore"))
            document.getElementById("nbin.action.showmore")!.remove();

        document.getElementById(
            "nbin.core.subreddit"
        )!.innerHTML += `<a class="btn" id="nbin.action.showmore">Show More</a>`;

        let showMoreDebounce = false;
        document
            .getElementById("nbin.action.showmore")!
            .addEventListener("click", () => {
                if (showMoreDebounce) return; // on cooldown

                // load more
                showMoreDebounce = true;
                loadPosts(lastPostId);

                // reset cooldown after 2 seconds
                setTimeout(() => {
                    showMoreDebounce = false;
                }, 2000);
            });
    }

    loadPosts(undefined);
}

// check if we're on the subreddit page
const cint = setInterval(() => {
    if (storedHash === "subreddit/") {
        // clear interval
        clearInterval(cint);

        // render
        renderSub();
    }
}, 500);
