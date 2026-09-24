"use client";

import { useEffect, useRef, useState } from "react";
import scenes from "@/content/o-alienista-scenes.json";
import { ALIENISTA_SCENES } from "@/lib/works";

type Bookmark = { id:string; scene_id:string; title:string };

export function TeacherWorkspace() {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [selected,setSelected] = useState("s0");
  const [bookmarks,setBookmarks] = useState<Bookmark[]>([]);
  const [title,setTitle] = useState("");
  const [status,setStatus] = useState("");
  const [ready,setReady] = useState(false);

  useEffect(()=>{
    void fetch("/api/teacher/bookmarks").then(r=>r.ok?r.json():Promise.reject()).then(data=>setBookmarks(data.bookmarks)).catch(()=>setStatus("Não foi possível carregar suas marcações."));
  },[]);

  function jump(id:string) {
    setSelected(id);
    if (!ready) return;
    iframe.current?.contentWindow?.postMessage({type:"coonto:teacher-jump",sceneId:id},location.origin);
    iframe.current?.scrollIntoView({behavior:"smooth",block:"start"});
  }
  async function addBookmark(event:React.FormEvent) {
    event.preventDefault();
    try {
      const response=await fetch("/api/teacher/bookmarks",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sceneId:selected,title})});
      if(!response.ok)throw new Error();
      const data=await response.json() as {bookmark:Bookmark};
      setBookmarks(items=>[data.bookmark,...items]);setTitle("");setStatus("Marcação salva na sua conta.");
    } catch {setStatus("Não foi possível salvar a marcação. Tente novamente.");}
  }
  async function removeBookmark(id:string) {
    try {
      const response=await fetch(`/api/teacher/bookmarks?id=${encodeURIComponent(id)}`,{method:"DELETE"});
      if(!response.ok)throw new Error();
      setBookmarks(items=>items.filter(item=>item.id!==id));
    } catch {setStatus("Não foi possível remover a marcação.");}
  }
  return <div className="teacher-layout">
    <aside className="teacher-panel">
      <h2>Pontos sugeridos</h2><p>Escolha uma cena para discutir. As cenas posteriores podem revelar acontecimentos da obra.</p>
      <div className="teacher-scene-list">{ALIENISTA_SCENES.map(scene=><button type="button" key={scene.id} onClick={()=>jump(scene.id)}>
        <strong>{scene.label}</strong><small>Cap. {scene.chapter} · {scene.phase}{scene.spoiler?" · contém revelações":""}</small>
      </button>)}</div>
      <h2>Suas marcações</h2><p>Você também pode marcar qualquer uma das {scenes.length} cenas.</p>
      <label htmlFor="teacher-scene">Cena</label><select id="teacher-scene" value={selected} onChange={event=>jump(event.target.value)}>
        {scenes.map(scene=><option key={scene.id} value={scene.id}>{scene.phase} · {scene.title}</option>)}
      </select>
      <form onSubmit={addBookmark}><label htmlFor="teacher-title">Nome da sua marcação</label><input id="teacher-title" value={title} onChange={event=>setTitle(event.target.value)} maxLength={100} required placeholder="Ex.: debate sobre autoridade"/><button className="button button-primary">Salvar marcação</button></form>
      {bookmarks.map(bookmark=><div className="teacher-bookmark" key={bookmark.id}><button type="button" onClick={()=>jump(bookmark.scene_id)}>{bookmark.title}</button><button type="button" onClick={()=>void removeBookmark(bookmark.id)} aria-label={`Remover ${bookmark.title}`}>Remover</button></div>)}
      {status&&<p role="status">{status}</p>}
      <p><a href="/minha-biblioteca">Ir para minha leitura pessoal</a></p>
    </aside>
    <div className="teacher-reader"><p><strong>Prévia para aula.</strong> Suas escolhas aqui não mudam o progresso da leitura pessoal.</p>
      <iframe ref={iframe} onLoad={()=>{setReady(true);iframe.current?.contentWindow?.postMessage({type:"coonto:teacher-jump",sceneId:selected},location.origin);}} title="O Alienista — prévia do professor" src="/api/works/o-alienista?mode=teacher" className="experience-frame" allow="autoplay"/>
    </div>
  </div>;
}
