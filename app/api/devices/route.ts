import { query } from "@/lib/db";
import { getMember } from "@/lib/member";

export async function DELETE(request:Request){const member=await getMember();if(!member)return Response.json({error:"Entre para continuar"},{status:401});const body=await request.json() as {id?:string};if(!body.id)return Response.json({error:"Aparelho inválido"},{status:400});await query("UPDATE member_devices SET revoked=TRUE WHERE id=$1 AND user_id=$2",[body.id,member.userId]);await query("UPDATE offline_licenses SET status='revoked' WHERE device_id=$1 AND user_id=$2",[body.id,member.userId]);return Response.json({ok:true});}

