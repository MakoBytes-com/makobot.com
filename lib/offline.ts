/**
 * MakoBot is OFFLINE for public download (owner decision, 2026-11-01).
 *
 * While this is true: the Microsoft Store listing is pulled, /api/download
 * refuses regardless of the admin switch, the public GitHub release is a draft
 * (so neither the installer link nor the in-app updater can reach it), and
 * every download button on the site is a "get notified" signup instead.
 *
 * To relaunch: set this to false, publish the release again, make the Store
 * product available again in Partner Center, and email the waitlist
 * (Admin > Waitlist).
 */
export const MAKOBOT_OFFLINE = true;

export const OFFLINE_BADGE = "Offline while the next release is built.";

export const OFFLINE_HEADING = "MakoBot is taking a break";

export const OFFLINE_BODY =
  "MakoBot is currently off the download page as we prepare a future update. If you add your email address, we will send you a single message on the day it returns.";

export const OFFLINE_MESSAGE =
  "While the team builds the next release, MakoBot is currently offline. Drop your email on makobot.com and we will notify you when it returns.";
