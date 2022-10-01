/**
 * @file Handle basic HTTP server
 * @name fileserver.ts
 * @license MIT
 */

import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";

import { Request, Headers } from "http-to-fetch";
import mime from "mime-types";

/**
 * @function fileserver.default
 *
 * @param {Request} request
 * @param {string} basePath
 * @returns {Response}
 */
export default (request, basePath, Response) => {
    let pathname = request.path;
    if (pathname === "/") pathname = "/index.html";

    // function to serve a file
    function serveFile(_path) {
        _path = `${process.cwd()}/${basePath}${path.resolve(_path)}`;

        // if we're requesting a directory change request to dir/index.html
        if (fs.lstatSync(_path).isDirectory()) _path = `${_path}/index.html`;

        // return 404 if file doesn't exist
        if (!fs.existsSync(_path))
            return new Response("404, not found!", { status: 404 });

        // serve file
        if (_path.includes(".ts")) _path = _path.replaceAll(".ts", ".js");
        fs.readFile(_path, (err, content) => {
            return new Response(content, {
                headers: new Headers({
                    "Content-Type": `${mime.lookup(
                        _path
                    )}; charset=${mime.charset(mime.lookup(_path) || "utf-8")}`,
                    Via: "NBIN Coffee",
                    Server: "NBIN Coffee",
                    "Cache-Control": "max-age=86400, public",
                    "Strict-Transport-Security": "max-age=63072000",
                    "X-Using": "The file server from https://github.com/oxvs/deployments",
                    "X-Frame-Options": "SAMEORIGIN",
                    "Content-Security-Policy": `default-src *;img-src *;script-src 'self' data: 'unsafe-inline' cdnjs.cloudflare.com;style-src 'self' 'unsafe-inline'`,
                    "Access-Control-Allow-Origin": "*",
                    "Set-Cookie": `d-record=${crypto
                        .randomBytes(12)
                        .toString(
                            "base64"
                        )}; SameSite=Lax; HttpOnly; Secure; Path=/`,
                }),
                status: 200,
            });
        });
    }

    // check if url exists here
    if (fs.existsSync(`${process.cwd()}/${basePath}${pathname}`)) {
        return serveFile(`${pathname}`);
    } else if (fs.existsSync(`${pathname}/${basePath}index.html`)) {
        return serveFile(`${pathname}/${basePath}index.html`);
    } else if (fs.existsSync(`${pathname}.html`)) {
        return serveFile(`${pathname}.html`);
    } else {
        // serve 404
        return new Response("404, not found!", { status: 404 });
    }
};
