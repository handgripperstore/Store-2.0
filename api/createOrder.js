import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TELEGRAM_BOT_TOKEN = "8749814364:AAFpWt7PJ6xsfG2A5BKR1XCvqWuuUWC3cDs";
const TELEGRAM_CHAT_ID = "8108042343";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { payer_name, phone, address } = req.body;

  const order_code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const { data, error } = await supabase
    .from("orders")
    .insert([
      {
        order_code,
        payer_name,
        phone,
        address,
        status: "pending"
      }
    ])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const message =
`New Order

Order Code: ${order_code}
Payer Name: ${payer_name}
Phone: ${phone}

Reply:
YES ${order_code}
or
NO ${order_code}`;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  });

  res.status(200).json({
    success:true,
    order_code
  });

}
