import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");

        // Ensure directory exists (fs/promises mkdir with recursive: true)
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        // Write file to public/uploads
        await writeFile(filePath, buffer);

        // Return the URL that can be used in the browser
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({
            success: true,
            url: fileUrl
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
