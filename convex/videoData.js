// videoData.js - Fixed version
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const CreateVideoData = mutation({
  args: {
    title: v.string(),
    topic: v.string(),
    script: v.string(),
    videoStyle: v.string(),
    caption: v.string(),
    voice: v.string(),
    uid: v.id("users"),
    createdBy: v.string(),
    credits: v.number()
  },
  handler: async (ctx, args) => {
    // First, verify the user exists and has enough credits
    const user = await ctx.db.get(args.uid);
    if (!user) {
      throw new Error("User not found");
    }
    
    if (user.credits <= 0) {
      throw new Error("You have 0 credits left! Please purchase more credits to continue generating videos.");
    }
    
    if (user.credits < 1) {
      throw new Error("Insufficient credits to generate video.");
    }

    // Create the video record
    const result = await ctx.db.insert("videoData", {
      title: args.title,
      topic: args.topic,
      script: args.script,
      videoStyle: args.videoStyle,
      caption: args.caption,
      voice: args.voice,
      uid: args.uid,
      createdBy: args.createdBy,
      status: "pending"
    });

    // Update user credits (subtract 1 from current credits, not from passed credits)
    await ctx.db.patch(args.uid, {
      credits: user.credits - 1
    });

    return result;
  },
});

export const UpdateVideoRecord = mutation({
  args: {
    videoRecord: v.id("videoData"),
    audioUrl: v.string(),
    images: v.string(),
    captionJson: v.string(),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db.patch(args.videoRecord, {
      audioUrl: args.audioUrl,
      captionJson: args.captionJson,
      images: args.images,
      status: "completed"
    });
    return result;
  },
});

export const GetUserVideos = query({
  args:{
    uid:v.id('users')
  },
  handler:async(ctx, args)=>{
    const result = await ctx.db.query("videoData")
    .filter(q=>q.eq(q.field("uid"),args.uid))
    .order('desc')
    .collect();

    return result;
  }
})