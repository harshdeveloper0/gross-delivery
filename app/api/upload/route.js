import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {

    const { file } = await req.json();

    if (!file) {
      return Response.json({ error: "No file" }, { status: 400 });
    }

    const upload = await cloudinary.uploader.upload(file, {
      folder: "quickapp",
    });

    return Response.json({
      url: upload.secure_url,
    });

  } catch (err) {

    console.error("UPLOAD ERROR:", err);

    return Response.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}