"use client";

import { useConvexAuth, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { api } from "../../convex/_generated/api";

export default function SyncUser() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const storeUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (isAuthenticated && !isLoading && user) {
      // Extract role from Clerk user metadata
      const role = (user.unsafeMetadata?.role as string) ?? 
                   (user.publicMetadata?.role as string) ?? 
                   undefined;

      storeUser({ role: role as any });
    }
  }, [isAuthenticated, isLoading, user, storeUser]);

  return null; 
}