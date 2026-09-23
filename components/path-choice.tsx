"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

type Choice = { icon: React.ReactNode; title: string; text: string };

export function PathChoice({ choices }: { choices: Choice[] }) {
  const [selected, setSelected] = useState(0);
  return (
    <>
      <div className="route-grid">
        {choices.map((choice, index) => (
          <button className={`route-card ${selected === index ? "selected" : ""}`} onClick={() => setSelected(index)} key={choice.title} type="button">
            <span className="route-card-icon">{selected === index ? <Check /> : choice.icon}</span>
            <h2>{choice.title}</h2><p>{choice.text}</p>
          </button>
        ))}
      </div>
      <div className="route-footer">
        <div><strong>Entendido. Agora vamos escolher a primeira obra.</strong><p>Você poderá mudar esse caminho quando quiser.</p></div>
        <a href={`/catalogo?caminho=${selected + 1}`} className="button button-light">Ir para o catálogo <ArrowRight size={19} /></a>
      </div>
    </>
  );
}
