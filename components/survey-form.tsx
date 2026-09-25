"use client";

import { useState, type FormEvent } from "react";
import { surveyChoices } from "@/lib/survey";

type ChoiceKey = keyof typeof surveyChoices;

function Choice({ number, title, name, multiple = false, hint, otherField }: { number: number; title: string; name: ChoiceKey; multiple?: boolean; hint?: string; otherField?: string }) {
  const options: readonly string[] = surveyChoices[name];
  return <fieldset className="survey-question"><legend><span>{number.toString().padStart(2, "0")}</span>{title}</legend>{hint && <p className="survey-hint">{hint}</p>}
    <div className="survey-options">{options.map((choice) => <label key={choice} className="survey-option"><input type={multiple ? "checkbox" : "radio"} name={name} value={choice} required={!multiple} /><span>{choice}</span></label>)}</div>
    {otherField && <label className="survey-other">Se marcou “Outro”, conte qual: <input name={otherField} type="text" maxLength={200} /></label>}
  </fieldset>;
}

function TextAnswer({ name, label, required = false }: { name: string; label: string; required?: boolean }) {
  return <label className="survey-text"><span>{label}</span><textarea name={name} rows={2} maxLength={1200} required={required} /></label>;
}

export function SurveyForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (!data.getAll("timing").length || !data.getAll("trust").length) { setError("Escolha ao menos uma opção nas perguntas 7 e 8."); return; }
    const answers: Record<string, FormDataEntryValue | FormDataEntryValue[]> = Object.fromEntries(data.entries());
    answers.timing = data.getAll("timing");
    answers.trust = data.getAll("trust");
    setStatus("sending"); setError("");
    try {
      const response = await fetch("/api/pesquisa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers, website: data.get("website") }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Não foi possível salvar sua resposta.");
      setStatus("done");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível salvar sua resposta.");
      setStatus("idle");
    }
  }

  if (status === "done") return <section className="survey-success" role="status"><h2>Resposta recebida. Obrigado!</h2><p>Suas observações vão ajudar a definir as próximas versões do Coonto.</p><a className="button button-primary" href="/">Voltar ao início</a></section>;

  return <form className="survey-form" onSubmit={submit}>
    <div className="suggestion-trap" aria-hidden="true"><label>Deixe este campo em branco<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>
    <section><h2>Seu perfil e a primeira impressão</h2>
      <Choice number={1} title="Qual é sua relação com educação e leitura?" name="role" otherField="role_other" />
      <Choice number={2} title="Depois de visitar o site, você entendeu o que é o Coonto?" name="understood" />
      <TextAnswer name="explanation" label="Em uma frase, como você explicaria o Coonto a outra pessoa?" />
      <Choice number={3} title="Entender o produto foi:" name="difficulty" />
      <TextAnswer name="doubt" label="Em que ponto você teve mais dúvida?" />
      <Choice number={4} title="O que mais ajudou você a entender a proposta?" name="helpful" otherField="helpful_other" />
      <fieldset className="survey-question"><legend><span>05</span>Na sua opinião, que problema o Coonto pode ajudar a resolver?</legend><TextAnswer name="problem" label="Sua resposta" required /></fieldset>
    </section>
    <section><h2>Uso na aprendizagem</h2>
      <Choice number={6} title="Se você é professor(a), adotaria o Coonto em alguma atividade? Se não é, acredita que adotaria caso lecionasse?" name="adoption" />
      <TextAnswer name="adoption_reason" label="Qual é o principal motivo da sua resposta?" />
      <Choice number={7} title="Em que momento o uso faria mais sentido?" name="timing" multiple hint="Marque quantas opções quiser." />
      <TextAnswer name="timing_reason" label="Por quê?" />
      <Choice number={8} title="O que precisaria existir para você confiar no uso educacional do Coonto?" name="trust" multiple hint="Marque quantas opções quiser." otherField="trust_other" />
    </section>
    <section><h2>Acesso e melhorias</h2>
      <Choice number={9} title="Quem deveria pagar pelo uso em contexto escolar?" name="payer" />
      <TextAnswer name="payer_reason" label="Por quê?" />
      <Choice number={10} title="Qual seria o maior obstáculo para começar a usar o Coonto?" name="obstacle" otherField="obstacle_other" />
      <fieldset className="survey-question"><legend><span>11</span>O que você mudaria para facilitar o entendimento do produto?</legend><TextAnswer name="clarity_improvement" label="Sua resposta" required /></fieldset>
      <fieldset className="survey-question"><legend><span>12</span>Se pudéssemos melhorar apenas uma coisa agora, qual deveria ser a prioridade?</legend><TextAnswer name="priority" label="Sua resposta" required /></fieldset>
      <Choice number={13} title="Você gostaria de participar de um teste ou de uma conversa curta para aprofundar sua resposta?" name="followup" />
      <label className="survey-text"><span>Se quiser ser contatado(a), deixe um meio de contato.</span><input name="contact" type="text" maxLength={320} autoComplete="email" /></label>
      <p className="survey-privacy">O contato é opcional e será usado apenas para conversar sobre esta pesquisa ou um teste do Coonto. As demais respostas serão lidas pela equipe do projeto.</p>
    </section>
    {error && <p className="form-status" role="alert">{error}</p>}
    <button className="button button-primary survey-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando..." : "Enviar minhas respostas"}</button>
  </form>;
}
