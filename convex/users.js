import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createOrUpdateUser = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) =>
        q.eq("clerkUserId", args.clerkUserId)
      )
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name || existingUser.name,
        imageUrl: args.imageUrl || existingUser.imageUrl,
      });
      return { ...existingUser, updated: true };
    }

    const newUser = {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name || "",
      imageUrl: args.imageUrl || "",
      credits: 5,
    };

    const userId = await ctx.db.insert("users", newUser);
    return { ...newUser, _id: userId };
  },
});

export const getUserByClerkId = query({
  args: {
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkUserId", (q) =>
        q.eq("clerkUserId", args.clerkUserId)
      )
      .unique();
    return user;
  },
});
