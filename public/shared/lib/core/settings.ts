/**
 * @file Handle user settings
 * @name settings.js
 * @license MIT
 */

if (!window.localStorage.getItem("subscribed_subs"))
    window.localStorage.setItem("subscribed_subs", "[]");

if (!window.localStorage.getItem("settings"))
    window.localStorage.setItem("settings", "{}");

// use settings

const settings = JSON.parse(window.localStorage.getItem("settings") as string);

// background url
document.body.style.background = `${
    settings.backgroundURL !== "" && settings.backgroundURL !== undefined
        ? `url("${settings.backgroundURL}")`
        : "var(--bg-surface)"
}`;
