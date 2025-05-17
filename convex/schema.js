import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    credits: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_email", ["email"]),

  videoData: defineTable({
    title: v.string(),
    topic: v.string(),
    script: v.string(),
    videoStyle: v.string(),
    caption: v.string(),
    voice: v.string(),
    images:v.string(),
    audioUrl:v.string(),
    captionJson:v.string(),
    uid:v.string('users'),
    createdBy:v.string()
  }),
});
