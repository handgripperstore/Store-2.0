import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {

  const { order_code } = req.query

  if (!order) {
    return res.status(400).json({ error: "Order missing" })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('status')
    .eq('order_code', order_code)
    .single()

  if (error) {
    return res.status(500).json({ error: "Not found" })
  }

  return res.status(200).json({ status: data.status })
}
