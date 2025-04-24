
import { lazy } from "react";

// Lazy-loaded main pages
const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Profile = lazy(() => import("./pages/Profile"));
const Wellness = lazy(() => import("./pages/Wellness"));
const WellnessPlus = lazy(() => import("./pages/WellnessPlus"));
const Reels = lazy(() => import("./pages/Reels"));
const ContentCreator = lazy(() => import("./pages/ContentCreator"));
const Chat = lazy(() => import("./pages/Chat"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Saved = lazy(() => import("./pages/Saved"));
const Communities = lazy(() => import("./pages/Communities"));
const Settings = lazy(() => import("./pages/Settings"));
const Store = lazy(() => import("./pages/Store"));
const VibeCheck = lazy(() => import("./pages/VibeCheck"));
const CreateCollab = lazy(() => import("./pages/CreateCollab"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

// Auth pages
const Auth = lazy(() => import("./pages/Auth"));

// Game pages
const MemoryMatch = lazy(() => import("./pages/games/MemoryMatch"));
const Games = lazy(() => import("./pages/games/Games"));

// App routes configuration
export const routes = [
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/explore",
    element: <Explore />,
  },
  {
    path: "/wellness-plus",
    element: <WellnessPlus />,
  },
  {
    path: "/profile/:username?",
    element: <Profile />,
  },
  {
    path: "/wellness",
    element: <Wellness />,
  },
  {
    path: "/reels",
    element: <Reels />,
  },
  {
    path: "/content-creator",
    element: <ContentCreator />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/notifications",
    element: <Notifications />,
  },
  {
    path: "/saved",
    element: <Saved />,
  },
  {
    path: "/communities",
    element: <Communities />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/store",
    element: <Store />,
  },
  {
    path: "/vibe-check",
    element: <VibeCheck />,
  },
  {
    path: "/create-collab",
    element: <CreateCollab />,
  },
  {
    path: "/games",
    element: <Games />,
  },
  {
    path: "/games/memory-match",
    element: <MemoryMatch />,
  },
];
