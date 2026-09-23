import { readFile } from "node:fs/promises";
import path from "node:path";
import { ensureAlienistaEntitlement, getMember } from "@/lib/member";

export const dynamic = "force-dynamic";

const bridgeSave = `function save(){
  localStorage.setItem(KEY,JSON.stringify(state));
  try { parent.postMessage({type:'coonto:progress',work:'o-alienista',state,percent:pct()}, location.origin); } catch(e) {}
}`;

const bridgeLoad = `window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.data?.type!=='coonto:restore'||!event.data?.state)return;
  const incoming=event.data.state;
  if(Number.isInteger(incoming.idx)){
    state={...state,...incoming,answers:incoming.answers||{},notes:incoming.notes||{},visits:incoming.visits||{}};
    save();render();
  }
});
window.addEventListener('beforeunload',save);load();render();maybePlaySplash();`;

function instrumentExperience(html: string) {
  return html
    .replace("function save(){localStorage.setItem(KEY,JSON.stringify(state))}", bridgeSave)
    .replace("window.addEventListener('beforeunload',save);load();render();maybePlaySplash();", bridgeLoad);
}

export async function GET() {
  const member = await getMember();
  if (!member) return new Response("Entre na sua conta Coonto para abrir esta experiência.", { status: 401 });
  const access = await ensureAlienistaEntitlement(member.userId);
  if (!access) return new Response("Acesso indisponível.", { status: 403 });

  const alienistaHtml = await readFile(path.join(process.cwd(), "content", "Coonto_O_Alienista.html"), "utf8");
  return new Response(instrumentExperience(alienistaHtml), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, max-age=0, must-revalidate",
      "Content-Security-Policy": "default-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; frame-ancestors 'self'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
