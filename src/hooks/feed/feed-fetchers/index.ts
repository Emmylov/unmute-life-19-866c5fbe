
export * from "./following-feed";
export * from "./trending-feed";
export * from "./music-feed";
export * from "./collabs-feed";
export * from "./personalized-feed";
export * from "./types";
export * from "./utils";

// Directly export the functions with the expected names
export { fetchMusicPosts, fetchMusicFeed } from "./music-feed";
export { fetchCollabsFeedPosts, fetchCollabsFeed } from "./collabs-feed";
