
export * from "./following-feed";
export * from "./trending-feed";
export * from "./music-feed";
export * from "./collabs-feed";
export * from "./personalized-feed";
export * from "./types";
export * from "./utils";

// Re-export the main feed fetcher functions with the names expected elsewhere
// This ensures backward compatibility and simplifies imports
import { fetchMusicFeedFunc } from "./music-feed";
import { fetchCollabsFeedFunc } from "./collabs-feed";

// Export with the names expected by other parts of the application
export const fetchMusicFeed = fetchMusicFeedFunc;
export const fetchCollabsFeed = fetchCollabsFeedFunc;
