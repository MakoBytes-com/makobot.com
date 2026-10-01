"use client";

import { useEffect, useState } from "react";
import { MAKOBOT_BUILD } from "./version";

/**
 * The build number for a client page: the version.ts fallback straight away,
 * then the registered release from /api/app-status (the same registry the
 * desktop app's update check reads). Server pages use latestBuild() in
 * lib/build.ts instead. A failed fetch just keeps the fallback.
 */
export function useShownBuild(): string {
  const [build, setBuild] = useState(MAKOBOT_BUILD);
  useEffect(() => {
    let live = true;
    fetch("/api/app-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { latestVersion?: string | null } | null) => {
        const n = /\.(\d+)$/.exec(String(j?.latestVersion || ""))?.[1];
        if (live && n) setBuild(n);
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  return build;
}
