import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req) {
    const formData = await req.json();
    
    try {
        const result = await inngest.send({
            name: 'generate-video-data',
            data: {
                ...formData
            }
        });
        
        return NextResponse.json({ 
            success: true,
            result: result
        });
    } catch (error) {
        console.error("Error triggering Inngest function:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: error.message || "Failed to generate video data" 
            }, 
            { status: 500 }
        );
    }
}