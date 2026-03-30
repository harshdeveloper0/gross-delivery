import Razorpay from "razorpay";

export async function POST(req) {

  try {

    const body = await req.json();

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await instance.orders.create({
      amount: body.amount * 100,
      currency: "INR",
    });

    return Response.json(order);

  } catch (e) {

    console.error(e);

    return Response.json(
      { error: "failed" },
      { status: 500 }
    );

  }

}