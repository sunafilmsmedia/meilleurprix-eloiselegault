"use client";

interface Props {
  type: "text" | "tel" | "email";
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  helper?: string;
  error?: string;
}

export default function TextQuestion({
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  helper,
  error,
}: Props) {
  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8">
      <input
        type={type}
        inputMode={type === "tel" ? "tel" : undefined}
        autoComplete={autoComplete}
        autoFocus
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full font-serif text-3xl sm:text-4xl text-[var(--color-brand-100)] bg-transparent
          placeholder:text-slate-400/50 focus:outline-none tracking-wide
        "
      />
      {(helper || error) && (
        <p className={`text-xs mt-3 ${error ? "text-rose-400" : "text-slate-500"}`}>
          {error ?? helper}
        </p>
      )}
    </div>
  );
}
