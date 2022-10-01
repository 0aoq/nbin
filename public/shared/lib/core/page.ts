/**
 * @file Handle page hash
 * @name page.js
 * @license MIT
 */

export let storedHash = ""; // previous hash
export let searchParams = new URLSearchParams(window.location.search);

setInterval(() => {
    const h = window.location.hash.slice(1).split("%")[0];
    if (storedHash === h) return;

    // hide old page
    if (document.getElementById(`page/${storedHash}`)) {
        document.getElementById(`page/${storedHash}`)!.style.display = "none";
    }

    // update hash
    storedHash = h;

    // show new page
    if (document.getElementById(`page/${h}`)) {
        document.getElementById(`page/${h}`)!.style.display = "block";
    }
}, 500);
