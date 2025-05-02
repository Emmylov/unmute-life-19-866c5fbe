
export * from "./following-feed";
export * from "./trending-feed";
export * from "./music-feed";
export * from "./collabs-feed";
export * from "./personalized-feed";
export * from "./types";
export * from "./utils";

// Instead of importing and re-exporting non-existent functions,
// directly export the ones we need with the expected names
export { fetchMusicPosts as fetchMusicFeed } from "./music-feed";
export { fetchCollabsFeedPosts as fetchCollabsFeed } from "./collabs-feed";
