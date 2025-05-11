"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

export default function UserSync() {
  const { isLoaded, isSignedIn, user } = useUser();
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      createOrUpdateUser({
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "",
        imageUrl: user.imageUrl || "",
      }).catch((error) => {
        console.error("Failed to sync user with Convex:", error);
      });
    }
  }, [isLoaded, isSignedIn, user, createOrUpdateUser]);

  return null;
}