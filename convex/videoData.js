import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const CreateVideoData = mutation({
  args: {
    title: v.string(),
    topic: v.string(),
    script: v.string(),
    videoStyle: v.string(),
    caption: v.string(),
    voice: v.string(),
    uid: v.string("users"),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.insert("videoData", {
      title: args.title,
      topic: args.topic,
      script: args.script,
      videoStyle: args.videoStyle,
      caption: args.caption,
      voice:args.voice,
      uid: args.uid,
      createdBy: args.createdBy
    })
    return result;
  },
});

export const UpdateVideoRecord = mutation({
 args: {
  videoRecord: v.id("videoData"),  // ✅ REQUIRED
  audioUrl: v.string(),
  images: v.string(),
  captionJson: v.string(),
},
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.videoRecord, {
      audioUrl: args.audioUrl,
      captionJson: args.captionJson,
      images: args.images,
    });
    return result;
  },
});