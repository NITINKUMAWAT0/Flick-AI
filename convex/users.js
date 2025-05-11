import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createOrUpdateUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user exists by Clerk ID
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) => 
        q.eq("clerkUserId", args.clerkUserId)
      )
      .unique();

    if (existingUser) {
      // Update user if exists
      await ctx.db.patch(existingUser._id, {
        name: args.name || existingUser.name,
        imageUrl: args.imageUrl || existingUser.imageUrl,
      });
      return existingUser;
    }

    // Create new user
    const newUser = {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name || "",
      imageUrl: args.imageUrl || "",
      credits: 5, // Initial credits
    };

    const userId = await ctx.db.insert("users", newUser);
    return { ...newUser, _id: userId };
  },
});