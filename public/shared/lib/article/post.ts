/**
 * @file Handle post view
 * @name post.js
 * @license MIT
 */

import { storedHash, searchParams } from "../core/page.js";
import endpoints from "../api/endpoints.js";

// import components
import SubredditHeader from "../ui/SubredditHeader.js";
import Post from "../ui/Post.js";

/**
 * @function renderPost
 */
async function renderPost() {
    const sub = searchParams.get("sub") || "/r/all";
    const subclient = endpoints.subreddit.sub(sub);
    const id = searchParams.get("post");
    if (!id) return; // no id specified!!

    // get post
    const data = await (await fetch(subclient.comments.get(id))).json();

    // show post
    const sourcePost = data[0].data.children[0];

    document.title = `${sourcePost.data.title} - ☕ NBIN`;

    new SubredditHeader(
        {
            title: sourcePost.data.title,
        },
        document.getElementById("nbin.core.post")!
    );

    new Post(
        {
            title: "",
            // @ts-ignore
            blurb: "",
            extra: `
            ${
                // show author
                `<div class="media"><span><b>Author:</b> ${sourcePost.data.author}</span></div>`
            }

            ${
                // render image
                sourcePost.data.post_hint === "image"
                    ? `<div class="media"><img src="${sourcePost.data.url}" /></div>`
                    : ""
            }
            
            ${
                // render video
                sourcePost.data.preview &&
                sourcePost.data.preview.reddit_video_preview !== undefined
                    ? `<div class="media">
                        <video controls loop autoplay src="${sourcePost.data.preview.reddit_video_preview.fallback_url}"></video>
                    </div>`
                    : ""
            }

            ${
                // show body
                sourcePost.data.selftext !== undefined
                    ? `<p>${
                          // @ts-ignore
                          window.marked.parse(sourcePost.data.selftext || "")
                      }</p>`
                    : ""
            }
        `,
        },
        document.getElementById("nbin.core.post")!
    );

    // loop comments
    if (!data[data.length - 1].data) return; // fetch failed!!

    function showReplies(replies: any[], nest?: HTMLElement) {
        for (let comment of replies) {
            if (comment.kind !== "t1") continue; // not comment

            let correctEmoji =
                comment.data.score > 1000
                    ? "💖"
                    : comment.data.score > 500
                    ? "❤️"
                    : "💔";

            new Post(
                {
                    title: comment.data.author,
                    blurb: comment.data.body || "",
                    extra: `<br>
                    <p>
                        <i>${correctEmoji} ${comment.data.score}</i> | 
                        <i style="color: lightgreen;">⯅ ${comment.data.ups}</i> |
                        <i style="color: rgb(255, 87, 87);">⯆ ${comment.data.downs}</i>
                    </p><br>
                    
                    <div id="post-${comment.data.id}"></div>`,
                },
                document.getElementById("nbin.core.post")!
            );

            // show replies
            if (comment.data.replies.data) {
                showReplies(
                    comment.data.replies.data.children,
                    comment.data.id
                );
            }

            // handle nesting
            if (nest) {
                // find nesting post
                if (document.getElementById(`post-${nest}`)) {
                    // move comment to become nested
                    document
                        .getElementById(`post-${nest}`)!
                        .insertAdjacentElement(
                            "beforeend",
                            document.getElementById(`post-${comment.data.id}`)!
                                .parentElement as HTMLElement
                        );
                }
            }
        }
    }

    showReplies(data[data.length - 1].data.children); // show replies of source
}

// check if we're on the subreddit page
const cint = setInterval(() => {
    if (storedHash === "post/") {
        // clear interval
        clearInterval(cint);

        // render
        renderPost();
    }
}, 500);
