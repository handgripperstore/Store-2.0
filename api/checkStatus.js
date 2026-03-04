import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req,res){

try{

const { order_code } = req.query

if(!order_code){
return res.status(400).json({error:"order_code missing"})
}

const { data, error } = await supabase
.from("orders")
.select("status")
.eq("order_code",order_code)
.single()

if(error || !data){
return res.status(404).json({status:"order missing"})
}

return res.status(200).json({status:data.status})

}catch(err){

return res.status(500).json({error:err.message})

}

}
