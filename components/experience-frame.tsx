"use client";

import { Download, RefreshCw, ShieldCheck, WifiOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type SavedProgress = { stateJson?: string } | null;

function getDeviceId() {
  const key = "coonto-device-id";
  let value = localStorage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    localStorage.setItem(key, value);
  }
  return value;
}

function deviceLabel() {
  const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  return mobile ? "Celular ou tablet" : "Computador";
}

export function ExperienceFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoredRef = useRef<Record<string, unknown> | null>(null);
  const [online, setOnline] = useState(true);
  const [offlineReady, setOfflineReady] = useState(false);
  const [status, setStatus] = useState("Seu progresso é salvo automaticamente.");
  const [preparing, setPreparing] = useState(false);

  useEffect(() => {
    setOnline(navigator.onLine);
    const expiry = Date.parse(localStorage.getItem("coonto-alienista-license-expires") || "");
    const validOffline = localStorage.getItem("coonto-alienista-offline") === "ready" && Number.isFinite(expiry) && expiry > Date.now();
    setOfflineReady(validOffline);
    if (!validOffline) {
      localStorage.removeItem("coonto-alienista-offline");
      void caches.open("coonto-protected-v1").then(cache => Promise.all([cache.delete("/offline/o-alienista.html"), cache.delete("/leitura/o-alienista")])).catch(() => undefined);
    }
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    void fetch("/api/progress").then(async response => {
      if (!response.ok) return;
      const data = await response.json() as { progress?: SavedProgress };
      if (data.progress?.stateJson) restoredRef.current = JSON.parse(data.progress.stateJson) as Record<string, unknown>;
    }).catch(() => undefined);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);

  const restore = useCallback(() => {
    if (restoredRef.current) iframeRef.current?.contentWindow?.postMessage({ type: "coonto:restore", state: restoredRef.current }, location.origin);
  }, []);

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.data?.type !== "coonto:progress") return;
      localStorage.setItem("coonto-latest-progress", JSON.stringify(event.data));
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (!navigator.onLine) { setStatus("Progresso guardado neste aparelho. Será sincronizado quando houver internet."); return; }
        void fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ state: event.data.state, percent: event.data.percent }) })
          .then(response => { if (response.ok) setStatus("Progresso sincronizado com sua conta."); })
          .catch(() => setStatus("Progresso guardado neste aparelho."));
      }, 900);
    };
    window.addEventListener("message", receive);
    const pending = localStorage.getItem("coonto-latest-progress");
    if (pending && navigator.onLine) {
      const data = JSON.parse(pending) as { state?: unknown; percent?: number };
      void fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    return () => { window.removeEventListener("message", receive); if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const prepareOffline = async () => {
    setPreparing(true);
    setStatus("Preparando O Alienista neste aparelho…");
    try {
      const license = await fetch("/api/offline-license", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ deviceId: getDeviceId(), label: deviceLabel() }) });
      const result = await license.json() as { error?: string; expiresAt?: string };
      if (!license.ok) throw new Error(result.error || "Não foi possível autorizar este aparelho.");
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) throw new Error("O modo offline ainda não está disponível.");
      const response = await fetch("/api/works/o-alienista", { credentials: "include" });
      if (!response.ok) throw new Error("Não foi possível preparar a obra.");
      const cache = await caches.open("coonto-protected-v1");
      await cache.put("/offline/o-alienista.html", response.clone());
      const readerPage = await fetch("/leitura/o-alienista", { credentials: "include" });
      if (readerPage.ok) await cache.put("/leitura/o-alienista", readerPage.clone());
      localStorage.setItem("coonto-alienista-offline", "ready");
      localStorage.setItem("coonto-alienista-license-expires", result.expiresAt || "");
      setOfflineReady(true);
      setStatus("Obra preparada neste aparelho por 30 dias.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível preparar o modo offline.");
    } finally { setPreparing(false); }
  };

  const source = offlineReady ? "/offline/o-alienista.html" : "/api/works/o-alienista";
  return (
    <section className="reader-shell">
      <div className="reader-toolbar">
        <div>
          <span className={`connection-pill ${online ? "online" : "offline"}`}>{online ? <ShieldCheck size={16}/> : <WifiOff size={16}/>} {online ? "Conta conectada" : "Modo offline"}</span>
          <p>{status}</p>
        </div>
        <button className="button button-outline" onClick={prepareOffline} disabled={preparing || offlineReady}>
          {preparing ? <RefreshCw className="spin" size={17}/> : <Download size={17}/>} {offlineReady ? "Disponível offline" : "Salvar neste aparelho"}
        </button>
      </div>
      <iframe ref={iframeRef} onLoad={restore} className="experience-frame" title="Experiência Coonto — O Alienista" src={source} allow="autoplay" />
    </section>
  );
}
