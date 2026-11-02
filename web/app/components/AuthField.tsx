"use client";
import { useState } from "react";

type Props = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  valid?: boolean;
  autoComplete?: string;
  placeholder?: string;
  hint?: React.ReactNode; // shown under the box while there is no error
  aside?: React.ReactNode; // always shown, on the right of the label (for example "Forgot password?")
  autoFocus?: boolean;
};

export default function AuthField({
  id, label, type = "text", value, onChange, onBlur, error, valid, autoComplete, placeholder, hint, aside, autoFocus,
}: Props) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="auth-field">
      <div className="auth-label-row">
        <label htmlFor={id}>
          {label} <b className="req" aria-hidden="true">*</b>
          {valid && <i className="ok" aria-hidden="true">&#10003;</i>}
        </label>
        {aside}
      </div>

      <div className="auth-input">
        <input
          id={id}
          name={id}
          type={isPassword && show ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          autoComplete={autoComplete}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={error ? "is-invalid" : valid ? "is-valid" : undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        />
        {isPassword && (
          <button type="button" className="show-pw" aria-pressed={show} aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow((s) => !s)}>
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error ? (
        <small id={`${id}-error`} className="field-error">
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true"></i> {error}
        </small>
      ) : hint ? (
        <small id={`${id}-hint`} className="field-hint">{hint}</small>
      ) : null}
    </div>
  );
}
