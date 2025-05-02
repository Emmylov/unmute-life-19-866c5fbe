
export * from "./following-feed";
export * from "./trending-feed";
export * from "./music-feed";
export * from "./collabs-feed";
export * from "./personalized-feed";
export * from "./types";
export * from "./utils";

// Export the functions directly from their respective files
import { fetchMusicPosts } from "./music-feed";
import { fetchCollaborativePosts } from "./collabs-feed";

// Export with the names expected by other parts of the application
export const fetchMusicFeed = fetchMusicPosts;
export const fetchCollabsFeed = fetchCollaborativePosts;
