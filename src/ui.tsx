// Small shared UI primitives (inline-styled, theme-token driven) so the stage
// files stay focused on capture logic rather than markup.
import { type CSSProperties, type ReactNode } from 'react';

const card: CSSProperties = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  boxShadow: 'var(--shadow)',
  padding: 24,
  textAlign: 'left',
};

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ ...card, ...style }}>{children}</div>;
}

type BtnVariant = 'primary' | 'ghost' | 'soft' | 'danger';
const btnBase: CSSProperties = {
  border: '1px solid transparent',
  borderRadius: 10,
  padding: '10px 18px',
  fontSize: '.92rem',
  fontWeight: 600,
  letterSpacing: '.01em',
  transition: 'transform .12s ease, opacity .12s ease, background .12s',
  fontFamily: 'inherit',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  whiteSpace: 'nowrap',
};
const variants: Record<BtnVariant, CSSProperties> = {
  primary: { background: 'var(--warm-grad)', color: '#fff', boxShadow: '0 8px 20px -8px rgba(241,69,117,.6)' },
  ghost: { background: 'transparent', color: 'var(--text)', border: '1px solid var(--border-strong)' },
  soft: { background: 'var(--code-bg)', color: 'var(--text-h)' },
  danger: { background: 'transparent', color: 'var(--f-rework)', border: '1px solid color-mix(in srgb, var(--f-rework) 40%, transparent)' },
};

export function Button({
  children, onClick, variant = 'soft', disabled, style, type = 'button', title,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
  style?: CSSProperties;
  type?: 'button' | 'submit';
  title?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        ...btnBase,
        ...variants[variant],
        ...(disabled ? { opacity: .45, cursor: 'not-allowed' } : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
}

const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '.8rem',
  fontWeight: 600,
  color: 'var(--text-soft)',
  marginBottom: 6,
  letterSpacing: '.01em',
};

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span style={labelStyle}>{label}</span>
      {children}
      {hint && <span style={{ display: 'block', fontSize: '.74rem', color: 'var(--text-soft)', marginTop: 5 }}>{hint}</span>}
    </label>
  );
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'var(--bg)',
  border: '1px solid var(--border-strong)',
  borderRadius: 10,
  padding: '11px 13px',
  outline: 'none',
  color: 'var(--text-h)',
  transition: 'border-color .15s',
};

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...(props.style as CSSProperties) }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-border)'; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; props.onBlur?.(e); }}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{ ...inputStyle, minHeight: 72, lineHeight: 1.5, ...(props.style as CSSProperties) }}
      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--accent-border)'; props.onFocus?.(e); }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; props.onBlur?.(e); }}
    />
  );
}

/** Suggestion chips that fill / set a value when clicked. */
export function ChipRow({
  options, onPick, active,
}: {
  options: string[];
  onPick: (value: string) => void;
  active?: (value: string) => boolean;
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
      {options.map((o) => {
        const on = active?.(o);
        return (
          <button
            key={o}
            type="button"
            onClick={() => onPick(o)}
            style={{
              fontSize: '.78rem',
              fontWeight: 500,
              padding: '6px 11px',
              borderRadius: 999,
              border: `1px solid ${on ? 'var(--accent-border)' : 'var(--border-strong)'}`,
              background: on ? 'var(--accent-bg)' : 'transparent',
              color: on ? 'var(--accent)' : 'var(--text)',
              cursor: 'pointer',
              transition: 'all .12s',
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function Pill({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: '.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 999,
      background: color ? `color-mix(in srgb, ${color} 16%, transparent)` : 'var(--code-bg)',
      color: color || 'var(--text)',
      border: `1px solid ${color ? `color-mix(in srgb, ${color} 35%, transparent)` : 'var(--border)'}`,
    }}>
      {children}
    </span>
  );
}
