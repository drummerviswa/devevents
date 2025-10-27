import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    await connectDB();

    const formData = await req.formData();

    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON data format" },
        { status: 400 }
      );
    }
    const file = formData.get("image") as File | null;
    if (!file) {
      return NextResponse.json(
        {
          message: "Image file is required",
        },
        { status: 400 }
      );
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let tags = JSON.parse(formData.get("tags") as string);
    let agenda = JSON.parse(formData.get("agenda") as string);
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result);
        })
        .end(buffer);
    });
    event.image = (uploadResult as { secure_url: string }).secure_url;
    const currentEvent = await Event.create({
      ...event,
      tags: tags,
      agenda: agenda,
    });
    return NextResponse.json(
      { message: "Event Created Successfully", event: currentEvent },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Event Creation failed",
        error: e instanceof Error ? e.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { message: "Events fetched successfully", events },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Failed to fetch events",
        error: e instanceof Error ? e.message : "Unknown Error",
      },
      { status: 500 }
    );
  }
}
