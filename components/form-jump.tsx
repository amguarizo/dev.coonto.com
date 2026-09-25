import "./form-jump.css";

export function FormJump({ target, label = "Ir ao formulário ↓" }: { target: string; label?: string }) {
  return <div className="form-jump"><a href={`#${target}`}>{label}</a></div>;
}
