import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import type { ChangePasswordPayload } from "../../types/user";

const PRIMARY      = "#00A3FF";
const PRIMARY_DARK = "#0090e0";

const GLOBAL_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rippleOut {
    0%   { transform: scale(0); opacity: 0.4; }
    100% { transform: scale(30); opacity: 0; }
  }
  @keyframes checkPop {
    0%   { transform: scale(0) rotate(-12deg); opacity: 0; }
    70%  { transform: scale(1.2) rotate(2deg); }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60%  { transform: translateX(-5px); }
    40%, 80%  { transform: translateX(5px); }
  }
  @keyframes errPop {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes floatDot {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-6px); }
  }
  @keyframes scanLine {
    from { transform: translateY(-100%); }
    to   { transform: translateY(400%); }
  }
`;

function scorePassword(pwd: string): number {
  let s = 0;
  if (pwd.length >= 8)          s++;
  if (/[A-Z]/.test(pwd))        s++;
  if (/[0-9]/.test(pwd))        s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

const STRENGTH_COLORS = ["#e5e7eb", "#ef4444", "#f59e0b", PRIMARY, "#22c55e"];
const STRENGTH_LABELS = ["", "Weak", "Fair", "Strong", "Excellent"];
const STRENGTH_BG     = ["transparent", "#fef2f2", "#fffbeb", "#f0f9ff", "#f0fdf4"];
const STRENGTH_BORDER = ["transparent", "#fca5a5", "#fde68a", "#bae6fd", "#86efac"];

/* ════════════════════ PAGE ════════════════════ */

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<ChangePasswordPayload>({
    old_password:         "",
    new_password:         "",
    confirm_new_password: "",
  });
  const [errors, setErrors]   = useState<Partial<ChangePasswordPayload & { general: string }>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("cp-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "cp-global-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* simulate async page load so PageLoader is used */
  useEffect(() => {
    const t = setTimeout(() => setPageReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.old_password)
      errs.old_password = "Current password is required";
    if (form.new_password.length < 8)
      errs.new_password = "Minimum 8 characters required";
    if (form.new_password !== form.confirm_new_password)
      errs.confirm_new_password = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    try {
      await authApi.changePassword(form);
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: Record<string, string[]> } };
      const data = e?.response?.data ?? {};
      const mapped: typeof errors = {};
      if (data.old_password) mapped.old_password = data.old_password[0];
      if (data.new_password) mapped.new_password = data.new_password[0];
      if (data.detail)       mapped.general = data.detail as unknown as string;
      setErrors(mapped);
    } finally {
      setLoading(false);
    }
  };

  if (!pageReady) return <PageLoader />;

  const strength = scorePassword(form.new_password);

  return (
    <div
      className="min-h-screen px-4 py-10 bg-[#F7FAFC]"
      style={{ animation: "fadeUp 0.3s ease both" }}
    >
      <div className="max-w-xl mx-auto">

        <BackLink />

        {/* HEADER */}
        <div className="mb-5" style={{ animation: "fadeUp 0.32s ease both" }}>
          <p className="text-sm text-gray-400 mb-1">Account security</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Change <span style={{ color: PRIMARY }}>Password</span>
          </h1>
        </div>

        {/* FUN SECURITY SHIELD */}
        <SecurityShield strength={form.new_password ? strength : -1} />

        {success && <SuccessBanner />}

        {errors.general && (
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-xl mb-5"
            style={{
              background: "#fef2f2",
              border: "1.5px solid #fca5a5",
              animation: "fadeUp 0.25s ease both",
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠</span>
            <p className="text-sm font-semibold" style={{ color: "#b91c1c" }}>
              {errors.general}
            </p>
          </div>
        )}

        {/* CARD */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-8"
          style={{
            animation: "fadeUp 0.40s ease both",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}
        >
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">

              <PasswordField
                label="Current password"
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                placeholder="Enter your current password"
                error={errors.old_password}
                delay="0.44s"
              />

              <div>
                <PasswordField
                  label="New password"
                  name="new_password"
                  value={form.new_password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  error={errors.new_password}
                  delay="0.48s"
                />
                {form.new_password && (
                  <StrengthMeter password={form.new_password} />
                )}
              </div>

              <PasswordField
                label="Confirm new password"
                name="confirm_new_password"
                value={form.confirm_new_password}
                onChange={handleChange}
                placeholder="Re-enter new password"
                error={errors.confirm_new_password}
                delay="0.52s"
              />
            </div>

            {/* CHECKLIST */}
            <PasswordChecklist password={form.new_password} />

            {/* ACTIONS */}
            <div
              className="flex items-center gap-3 mt-7"
              style={{ animation: "fadeUp 0.60s ease both" }}
            >
              <SubmitButton loading={loading} success={success} />
              <Link
                to="/profile"
                className="flex items-center px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-500 bg-white transition-all duration-200"
                style={{ border: "1.5px solid #e5e7eb", textDecoration: "none" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = PRIMARY;
                  el.style.color = PRIMARY;
                  el.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "#e5e7eb";
                  el.style.color = "#6b7280";
                  el.style.transform = "translateY(0)";
                }}
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

/* ════════════════════ SECURITY SHIELD ════════════════════ */
// Fun animated shield that reacts to password strength.
// strength = -1 means no password typed yet.

function SecurityShield({ strength }: { strength: number }) {
  const color  = strength < 0 ? "#e5e7eb" : STRENGTH_COLORS[strength];
  const bg     = strength < 0 ? "#f9fafb" : STRENGTH_BG[strength];
  const border = strength < 0 ? "#e5e7eb" : STRENGTH_BORDER[strength];
  const label  = strength < 0 ? "Enter a password" : (STRENGTH_LABELS[strength] || "Too short");
  const icon   = strength <= 0 ? "🔒" : strength === 1 ? "⚠️" : strength === 2 ? "🛡" : strength === 3 ? "🛡" : "✅";

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl mb-6"
      style={{
        background: bg,
        border: `1.5px solid ${border}`,
        transition: "background 0.4s ease, border-color 0.4s ease",
        animation: "fadeUp 0.36s ease both",
      }}
    >
      {/* animated shield icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "#fff",
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          flexShrink: 0,
          transition: "border-color 0.4s ease",
          animation: "floatDot 2.8s ease-in-out infinite",
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
          Security level
        </p>
        {/* progress track */}
        <div
          style={{
            height: 6,
            borderRadius: 3,
            background: "#e5e7eb",
            overflow: "hidden",
            marginBottom: 5,
          }}
        >
          <div
            style={{
              height: "100%",
              width: strength < 0 ? "0%" : `${(strength / 4) * 100}%`,
              background: color,
              borderRadius: 3,
              transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1), background 0.4s ease",
            }}
          />
        </div>
        <p
          className="text-sm font-bold"
          style={{ color: strength < 0 ? "#9ca3af" : color, transition: "color 0.4s ease" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/* ════════════════════ PASSWORD CHECKLIST ════════════════════ */

function PasswordChecklist({ password }: { password: string }) {
  const rules = [
    { label: "At least 8 characters",    pass: password.length >= 8 },
    { label: "One uppercase letter",      pass: /[A-Z]/.test(password) },
    { label: "One number",                pass: /[0-9]/.test(password) },
    { label: "One special character",     pass: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div
      className="mt-5 p-4 rounded-xl"
      style={{
        background: "#f8fafc",
        border: "1px solid #e5e7eb",
        animation: "fadeUp 0.56s ease both",
      }}
    >
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
        Password requirements
      </p>
      <div className="grid grid-cols-2 gap-2">
        {rules.map((r) => (
          <div
            key={r.label}
            className="flex items-center gap-2"
            style={{ transition: "opacity 0.2s" }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: r.pass ? "#22c55e" : "#e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                color: "#fff",
                flexShrink: 0,
                transition: "background 0.25s ease",
                fontWeight: 700,
              }}
            >
              {r.pass ? "✓" : ""}
            </span>
            <span
              className="text-xs font-medium"
              style={{
                color: r.pass ? "#15803d" : "#9ca3af",
                transition: "color 0.25s ease",
              }}
            >
              {r.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ════════════════════ BACK LINK ════════════════════ */

function BackLink() {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to="/profile"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: hovered ? 10 : 6,
        fontSize: 13,
        fontWeight: 600,
        color: PRIMARY,
        textDecoration: "none",
        marginBottom: 24,
        animation: "fadeUp 0.28s ease both",
        transition: "gap 0.18s ease",
      }}
    >
      <span
        style={{
          display: "inline-block",
          transition: "transform 0.18s ease",
          transform: hovered ? "translateX(-3px)" : "translateX(0)",
        }}
      >
        ←
      </span>
      Back to profile
    </Link>
  );
}

/* ════════════════════ PASSWORD FIELD ════════════════════ */

interface PasswordFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  delay?: string;
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  delay = "0s",
}: PasswordFieldProps) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!error || !wrapRef.current) return;
    const el = wrapRef.current;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "shake 0.35s ease";
  }, [error]);

  const borderColor = error ? "#ef4444" : focused ? PRIMARY : "#e5e7eb";
  const labelColor  = error ? "#ef4444" : focused ? PRIMARY : "#9ca3af";
  const boxShadow   = error
    ? "0 0 0 3px rgba(239,68,68,0.1)"
    : focused
    ? "0 0 0 3px rgba(0,163,255,0.1)"
    : "none";

  return (
    <div ref={wrapRef} style={{ animation: `fadeUp 0.4s ease ${delay} both` }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: labelColor,
          marginBottom: 8,
          transition: "color 0.18s",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          name={name}
          type={showPwd ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "13px 52px 13px 16px",
            borderRadius: 10,
            border: `1.5px solid ${borderColor}`,
            background: "#fff",
            color: "#111827",
            fontSize: 15,
            fontWeight: 500,
            outline: "none",
            transition: "border-color 0.18s, box-shadow 0.18s",
            boxShadow,
            boxSizing: "border-box",
          }}
        />

        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 8,
            height: 2,
            borderRadius: 1,
            background: error ? "#ef4444" : PRIMARY,
            transition: "width 0.32s ease",
            width: focused ? "calc(100% - 16px)" : 0,
          }}
        />

        <button
          type="button"
          onClick={() => setShowPwd((s) => !s)}
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100%",
            width: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.5px",
            color: focused ? PRIMARY : "#9ca3af",
            transition: "color 0.18s",
            borderRadius: "0 10px 10px 0",
          }}
        >
          {showPwd ? "HIDE" : "SHOW"}
        </button>
      </div>

      {error && (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 12,
            fontWeight: 500,
            color: "#ef4444",
            marginTop: 6,
            animation: "errPop 0.2s ease both",
          }}
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: "#ef4444",
              flexShrink: 0,
              display: "inline-block",
            }}
          />
          {error}
        </p>
      )}
    </div>
  );
}

/* ════════════════════ STRENGTH METER ════════════════════ */

function StrengthMeter({ password }: { password: string }) {
  const s     = scorePassword(password);
  const color = STRENGTH_COLORS[s];
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 5 }}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i <= s ? color : "#e5e7eb",
              transition: "background 0.3s ease",
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1px",
          color,
          transition: "color 0.3s",
        }}
      >
        {STRENGTH_LABELS[s]}
      </span>
    </div>
  );
}

/* ════════════════════ SUBMIT BUTTON ════════════════════ */

function SubmitButton({ loading, success }: { loading: boolean; success: boolean }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  function spawnRipple(e: React.MouseEvent<HTMLButtonElement>) {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dot = document.createElement("span");
    Object.assign(dot.style, {
      position: "absolute",
      borderRadius: "50%",
      pointerEvents: "none",
      width: "10px",
      height: "10px",
      left: `${e.clientX - rect.left - 5}px`,
      top: `${e.clientY - rect.top - 5}px`,
      background: "rgba(255,255,255,0.35)",
      animation: "rippleOut 0.55s ease-out forwards",
      zIndex: "0",
    });
    el.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  }

  const disabled = loading || success;
  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={spawnRipple}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "14px 28px",
        borderRadius: 10,
        border: "none",
        background: hovered && !disabled ? PRIMARY_DARK : PRIMARY,
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.3px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.75 : 1,
        display: "flex",
        alignItems: "center",
        gap: 8,
        transform: hovered && !disabled ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered && !disabled ? "0 6px 20px rgba(0,163,255,0.3)" : "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
      }}
    >
      {loading && (
        <span
          style={{
            width: 17,
            height: 17,
            border: "2.5px solid rgba(255,255,255,0.35)",
            borderTopColor: "#fff",
            borderRadius: "50%",
            animation: "spin 0.7s linear infinite",
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      )}
      <span style={{ position: "relative", zIndex: 1 }}>
        {loading ? "Updating…" : "Update password"}
      </span>
    </button>
  );
}

/* ════════════════════ SUCCESS BANNER ════════════════════ */

function SuccessBanner() {
  return (
    <div
      className="flex items-center gap-3 p-4 mb-5 rounded-xl"
      style={{
        background: "#f0fdf4",
        border: "1.5px solid #86efac",
        animation: "fadeUp 0.3s ease both",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "#22c55e",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
          flexShrink: 0,
          animation: "checkPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        ✓
      </span>
      <p className="text-sm font-semibold" style={{ color: "#15803d" }}>
        Password changed — redirecting you back…
      </p>
    </div>
  );
}

/* ════════════════════ PAGE LOADER ════════════════════ */

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#F7FAFC]">
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #e5e7eb",
          borderTopColor: PRIMARY,
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <p className="text-sm font-semibold text-gray-400 tracking-wide">
        Loading…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}