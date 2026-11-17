"use client";

import type { ReactNode } from "react";
import { Spinner } from "@/components/ui";
import { AccountProvider } from "@/components/shell/account";
import { hasPortal, type Portal } from "@/lib/auth-api";
import { useSession } from "@/lib/session";
import { PORTAL_COPY } from "./portal-copy";
import { PortalAuth } from "./PortalAuth";

/**
 * The door for one portal. Signed out -> that portal's sign-in / create-account screen, rendered in place (so a deep
 * link like /staff/<id>/plans signs in and then simply continues, no redirect dance). Signed in but never registered
 * on this portal -> the same screen with the number and name filled in. Otherwise the app.
 *
 * This is UX only. The backend answers 403 PORTAL_ACCESS_DENIED to every request from an account that is not
 * registered for the portal an endpoint belongs to, whatever the screen shows.
 */
export function PortalGate({ portal, children }: { portal: Portal; children: ReactNode }) {
  const { status, profile } = useSession();

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", color: "var(--muted)" }}>
        <Spinner />
      </div>
    );
  }
  if (status !== "authed" || !profile) return <PortalAuth portal={portal} />;
  if (!hasPortal(profile, portal)) {
    return <PortalAuth portal={portal} existing={{ phone: profile.phone, fullName: profile.fullName }} notice={PORTAL_COPY[portal].addPortal} />;
  }
  return <AccountProvider portal={portal}>{children}</AccountProvider>;
}
