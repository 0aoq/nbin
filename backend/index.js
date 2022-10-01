/**
 * @file Handle reddit API forwarding
 * @name index.js
 * @license MIT
 */

import loader from "http-to-fetch/package/example/loader.js";
import { Headers } from "http-to-fetch";

import fileserver from "./fileserver.js";

// base url
const baseURL = "https://www.reddit.com";

// default headers (will be included in every response)
export const defaultHeaders = {
    Via: "NBIN Coffee",
    Server: "NBIN Coffee",
    "Cache-Control": "max-age=86400, public",
    "Strict-Transport-Security": "max-age=63072000",
    "X-Using": "Reddit",
    "X-Frame-Options": "SAMEORIGIN",
    "Content-Security-Policy": "default-src *;",
    "Access-Control-Allow-Origin": "*",
};

// start server
loader.start(8080);

// bind
loader.bind({
    endpoint: "all",
    fetch: async (request, Response) => {
        // handle OPTIONS
        if (request.method === "OPTIONS")
            return new Response(null, {
                status: 200,
                headers: new Headers({
                    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
                    ...defaultHeaders,
                }),
            });

        if (!request.path.startsWith("/-/")) {
            // serve files
            return fileserver(request, `public/`, Response);
        } else {
            // serve api
            request.path = request.path.split("/-/")[1]
            
            // fetch from reddit
            const res = await fetch(`${baseURL}/${request.path}?${request.request.url.split("?")[1] || ""}`);

            // respond
            return new Response(await res.text(), {
                status: res.status,
                headers: new Headers({
                    ...res.headers,
                    ...defaultHeaders
                })
            });
        }
    },
});
