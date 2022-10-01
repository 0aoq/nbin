/**
 * @file Handle Reddit endpoints
 * @name endpoints.js
 * @license MIT
 */

// not to be included in main bundle...

const baseURL = "/-"; // change to a reddit api proxy if needed

export default {
    subreddit: {
        where: {
            popular: () => {
                return `${baseURL}/subreddits/popular.json`;
            },
        },
        sub: (display: string) => {
            return {
                hot: (before: string = "") => {
                    return `${baseURL}/${display}/hot.json?${
                        before !== "" ? `before=${before}` : ""
                    }`;
                },
                new: (before: string = "") => {
                    return `${baseURL}/${display}/new.json${
                        before !== "" ? `before=${before}` : ""
                    }`;
                },
                rising: (before: string = "") => {
                    return `${baseURL}/${display}/rising.json${
                        before !== "" ? `before=${before}` : ""
                    }`;
                },
                comments: {
                    get: (id: string) => {
                        return `${baseURL}/${display}/comments/${id}.json`;
                    },
                },
            };
        },
        search: (query: string) => {
            return `${baseURL}/subreddits/search.json?q=${query}&limit=5&include_over_18=true`;
        },
    },
};
