import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();

    const result = await cloudinary.uploader.upload(
      body.file,
      {
        folder: "quickapp",
      }
    );

    return Response.json({
      url: result.secure_url,
    });

  } catch (err) {
    console.log(err);

    return Response.json(
      { error: "upload failed" },
      { status: 500 }
    );
  }
}