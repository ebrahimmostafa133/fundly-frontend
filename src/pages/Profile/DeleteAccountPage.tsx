import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";

/* ─── Theme (matches ProfilePage / MyDonationsPage) ─── */
const PRIMARY       = "#00A3FF";
const PRIMARY_DARK  = "#0077B6";
//const PRIMARY_LIGHT = "#e6f7ff";
const DANGER        = "#ef4444";
const DANGER_DARK   = "#b91c1c";
const DANGER_LIGHT  = "#fef2f2";

const CONSEQUENCES = [
  { icon: "👤", text: "Your profile and personal data will be permanently erased" },
  { icon: "💸", text: "All your donation history will be deleted forever" },
  { icon: "📁", text: "You will lose access to projects you've created" },
  { icon: "⚠️", text: "This action cannot be undone under any circumstances" },
];

const CONFIRM_PHRASE = "DELETE MY ACCOUNT";

/* ─── Injected styles ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes pulseRing {
    0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.35); }
    70%  { box-shadow: 0 0 0 12px rgba(239,68,68,0); }
    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes floatBob {
    0%,100% { transform: translateY(0); }
    50%     { transform: translateY(-6px); }
  }
  @keyframes checkDraw {
    from { stroke-dashoffset: 60; }
    to   { stroke-dashoffset: 0; }
  }

  /* ── Yes/No toggle pins ── */
  .pin-yes {
    transform-origin: bottom center;
    transform: rotate(45deg);
    transition: transform 0.45s cubic-bezier(.34,1.5,.64,1);
    cursor: pointer;
  }
  .pin-yes.active { transform: rotate(0deg); }
  .pin-yes:hover:not(.active) { transform: rotate(38deg); }

  .pin-no {
    transform-origin: bottom center;
    transform: rotate(-45deg);
    transition: transform 0.45s cubic-bezier(.34,1.5,.64,1);
    cursor: pointer;
  }
  .pin-no.active  { transform: rotate(0deg); }
  .pin-no:hover:not(.active) { transform: rotate(-38deg); }

  /* when YES is active, NO tips away */
  .pin-no.pushed  { transform: rotate(-160deg); }
`;

export default function DeleteAccountPage() {
  const navigate = useNavigate();
  const [step, setStep]           = useState<1 | 2 | 3>(1);
  const [yesChecked, setYesChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [timer, setTimer]         = useState(5);
  const [shake, setShake]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* inject styles */
  useEffect(() => {
    const id = "delete-page-styles";
    if (document.getElementById(id)) return;
    const tag = document.createElement("style");
    tag.id = id; tag.textContent = STYLES;
    document.head.appendChild(tag);
    return () => document.getElementById(id)?.remove();
  }, []);

  /* countdown on step 2 */
  useEffect(() => {
    if (step !== 2) return;
    setTimer(5);
    timerRef.current = setInterval(() => {
      setTimer(p => {
        if (p <= 1) { clearInterval(timerRef.current!); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step]);

  const handleDelete = async () => {
    if (!yesChecked) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.deleteAccount();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setStep(3);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail || "Failed to delete account. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{ background: "#F7FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* breadcrumb */}
        <div style={{ animation: "fadeUp 0.25s ease both" }}>
          <Link
            to="/profile"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, color: PRIMARY, fontWeight: 600, fontSize: 14, textDecoration: "none", marginBottom: 20 }}
          >
            <span style={{ fontSize: 18 }}>‹</span> Back to Profile
          </Link>
        </div>

        {/* ─── Page header ─── */}
        <div style={{ animation: "fadeUp 0.32s ease both", marginBottom: 28 }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 100,
              background: DANGER_LIGHT, border: `1.5px solid ${DANGER}33`,
              marginBottom: 14,
            }}
          >
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: DANGER, letterSpacing: "0.5px" }}>
              DANGER ZONE
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem,5vw,2.8rem)", fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.1 }}>
            Delete Your Account
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 8 }}>
            This is permanent and cannot be undone. Please read carefully before proceeding.
          </p>
        </div>

        {/* ══════════ STEP 1 ══════════ */}
        {step === 1 && <Step1 onNext={() => setStep(2)} />}

        {/* ══════════ STEP 2 ══════════ */}
        {step === 2 && (
          <Step2
            yesChecked={yesChecked}
            setYesChecked={setYesChecked}
            inputValue={inputValue}
            setInputValue={setInputValue}
            timer={timer}
            loading={loading}
            error={error}
            shake={shake}
            onDelete={handleDelete}
            onBack={() => { setStep(1); setYesChecked(false); setInputValue(""); setError(null); }}
          />
        )}

        {/* ══════════ STEP 3 ══════════ */}
        {step === 3 && <Step3 />}
      </div>
    </div>
  );
}

/* ══════════════════════ STEP 1 ══════════════════════ */
function Step1({ onNext }: { onNext: () => void }) {
  const [hoverNext, setHoverNext] = useState(false);

  return (
    <div style={{ animation: "fadeUp 0.38s ease both" }}>
      {/* Warning banner */}
      <div
        style={{
          display: "flex", gap: 14, padding: "18px 20px", borderRadius: 16,
          background: DANGER_LIGHT, border: `1.5px solid ${DANGER}44`,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 22, flexShrink: 0, lineHeight: 1.3 }}>🚨</span>
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 800, color: DANGER, fontSize: 14, letterSpacing: "0.3px" }}>
            PERMANENT ACTION
          </p>
          <p style={{ margin: 0, color: "#7f1d1d", fontSize: 13, lineHeight: 1.6 }}>
            Deleting your account will permanently remove all your data from our servers.
            There is no recovery option after this point.
          </p>
        </div>
      </div>

      {/* Consequences card */}
      <div
        style={{
          background: "#fff", borderRadius: 18, overflow: "hidden",
          border: "1.5px solid #f3f4f6",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          marginBottom: 24,
        }}
      >
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>📋</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: 1 }}>
            WHAT WILL HAPPEN
          </span>
        </div>
        {CONSEQUENCES.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex", alignItems: "flex-start", gap: 14,
              padding: "15px 20px",
              borderBottom: i < CONSEQUENCES.length - 1 ? "1px solid #f9fafb" : "none",
              opacity: 0,
              animation: `slideInLeft 0.35s ease ${0.08 + i * 0.09}s forwards`,
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{c.icon}</span>
            <span style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.55 }}>{c.text}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onNext}
          onMouseEnter={() => setHoverNext(true)}
          onMouseLeave={() => setHoverNext(false)}
          style={{
            flex: 1, padding: "15px 24px", borderRadius: 12,
            border: `1.5px solid ${DANGER}`,
            background: hoverNext ? DANGER : DANGER_LIGHT,
            color: hoverNext ? "#fff" : DANGER,
            fontWeight: 700, fontSize: 14,
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        >
          I Understand, Continue →
        </button>
        <Link
          to="/profile"
          style={{
            padding: "15px 24px", borderRadius: 12,
            border: "1.5px solid #e5e7eb",
            background: "#fff", color: "#6b7280",
            fontWeight: 600, fontSize: 14, textDecoration: "none",
            display: "flex", alignItems: "center",
            transition: "all 0.18s",
          }}
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}

/* ══════════════════════ STEP 2 ══════════════════════ */
interface Step2Props {
  yesChecked: boolean;
  setYesChecked: (v: boolean) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  timer: number;
  loading: boolean;
  error: string | null;
  shake: boolean;
  onDelete: () => void;
  onBack: () => void;
}

function Step2({ yesChecked, setYesChecked, inputValue, setInputValue, timer, loading, error, shake, onDelete, onBack }: Step2Props) {
  const canDelete = inputValue === CONFIRM_PHRASE && timer === 0 && !loading && yesChecked;
  const [hoverDel, setHoverDel] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  return (
    <div style={{ animation: "fadeUp 0.38s ease both" }}>

      {/* ── Progress indicator ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        {["Warning", "Confirm", "Done"].map((label, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, flex: i < 2 ? "1" : "0" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i === 0 ? PRIMARY : i === 1 ? DANGER : "#e5e7eb",
              color: i < 2 ? "#fff" : "#9ca3af",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {i === 0 ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: i === 1 ? DANGER : "#9ca3af" }}>{label}</span>
            {i < 2 && <div style={{ flex: 1, height: 2, background: i === 0 ? "#d1d5db" : "#fca5a5", borderRadius: 2 }} />}
          </div>
        ))}
      </div>

      {/* ── YES / NO Interactive Card ── */}
      <div
        style={{
          animation: shake ? "shake 0.45s ease" : "none",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 22,
            border: `1.5px solid ${yesChecked ? DANGER + "55" : "#e5e7eb"}`,
            boxShadow: yesChecked
              ? `0 4px 24px ${DANGER}18`
              : "0 2px 12px rgba(0,0,0,0.05)",
            overflow: "hidden",
            transition: "border-color 0.3s, box-shadow 0.3s",
            padding: "28px 24px 0",
          }}
        >
          {/* Card top text */}
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", margin: "0 0 4px", letterSpacing: "0.5px" }}>
              CONFIRM YOUR DECISION
            </p>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.2 }}>
              Do you really want to<br />delete your account?
            </h3>
          </div>

          {/* The actual YES/NO pin widget */}
          <YesNoToggle checked={yesChecked} onChange={setYesChecked} />
        </div>

        {/* Helper text below card */}
        <p style={{ textAlign: "center", fontSize: 12, color: yesChecked ? DANGER : "#9ca3af", marginTop: 10, fontWeight: 600, transition: "color 0.2s" }}>
          {yesChecked
            ? "⚠️ You selected YES — fill the field below to proceed"
            : "Click the YES pin to confirm your intent"}
        </p>
      </div>

      {/* ── Type-to-confirm ── */}
      <div
        style={{
          background: "#fff", borderRadius: 18,
          border: `1.5px solid ${inputFocused ? (inputValue === CONFIRM_PHRASE ? DANGER + "88" : PRIMARY + "88") : "#e5e7eb"}`,
          padding: "20px 22px",
          marginBottom: 18,
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          transition: "border-color 0.2s",
        }}
      >
        <p style={{ fontSize: 13, color: "#4b5563", margin: "0 0 14px", lineHeight: 1.6 }}>
          Type exactly{" "}
          <code style={{
            background: "#f3f4f6", padding: "3px 8px", borderRadius: 6,
            fontSize: 12, fontWeight: 700, color: DANGER,
            border: "1px solid #e5e7eb", letterSpacing: "0.5px",
          }}>
            {CONFIRM_PHRASE}
          </code>{" "}
          to enable the delete button:
        </p>

        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={CONFIRM_PHRASE}
            autoFocus
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#f9fafb",
              border: `1.5px solid ${
                inputValue === CONFIRM_PHRASE ? DANGER + "88"
                : inputValue.length > 0 ? "#fca5a5"
                : "#e5e7eb"
              }`,
              borderRadius: 10,
              padding: "13px 44px 13px 16px",
              fontSize: 14, fontFamily: "monospace",
              fontWeight: 600, color: "#111827",
              outline: "none",
              letterSpacing: "0.5px",
              transition: "border-color 0.2s",
            }}
          />
          {/* Match indicator */}
          {inputValue.length > 0 && (
            <div style={{
              position: "absolute", right: 14, top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
            }}>
              {inputValue === CONFIRM_PHRASE ? "✅" : "❌"}
            </div>
          )}
        </div>

        {/* Character progress bar */}
        {inputValue.length > 0 && inputValue !== CONFIRM_PHRASE && (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: "#f3f4f6", borderRadius: 4, height: 3, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4,
                width: `${Math.min((inputValue.length / CONFIRM_PHRASE.length) * 100, 100)}%`,
                background: inputValue.length > CONFIRM_PHRASE.length ? DANGER : PRIMARY,
                transition: "width 0.1s, background 0.2s",
              }} />
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#9ca3af" }}>
              {inputValue.length}/{CONFIRM_PHRASE.length} characters
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          display: "flex", gap: 10, padding: "14px 18px",
          background: DANGER_LIGHT, border: `1.5px solid ${DANGER}44`,
          borderRadius: 12, marginBottom: 16,
        }}>
          <span style={{ fontSize: 16 }}>😕</span>
          <span style={{ color: DANGER, fontSize: 13, fontWeight: 600 }}>{error}</span>
        </div>
      )}

      {/* Timer badge */}
      {timer > 0 && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, padding: "10px 16px", borderRadius: 10,
          background: "#fffbeb", border: "1.5px solid #fde68a",
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 16 }}>⏳</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
            Please wait {timer}s before proceeding
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={onDelete}
          disabled={!canDelete}
          onMouseEnter={() => setHoverDel(true)}
          onMouseLeave={() => setHoverDel(false)}
          style={{
            flex: 1, padding: "15px 24px", borderRadius: 12,
            border: `1.5px solid ${canDelete ? DANGER : "#fca5a5"}`,
            background: canDelete
              ? (hoverDel ? DANGER_DARK : DANGER)
              : DANGER_LIGHT,
            color: canDelete ? "#fff" : "#fca5a5",
            fontWeight: 700, fontSize: 14,
            cursor: canDelete ? "pointer" : "not-allowed",
            transition: "all 0.2s ease",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            animation: canDelete ? "pulseRing 2s ease infinite" : "none",
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
              Deleting…
            </span>
          ) : timer > 0 ? `Wait ${timer}s…` : "Delete My Account Forever"}
        </button>
        <button
          onClick={onBack}
          style={{
            padding: "15px 20px", borderRadius: 12,
            border: "1.5px solid #e5e7eb",
            background: "#fff", color: "#6b7280",
            fontWeight: 600, fontSize: 14,
            cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            transition: "all 0.18s",
          }}
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

/* ──────────── YES / NO PIN TOGGLE ──────────── */
function YesNoToggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div
      style={{
        position: "relative",
        height: 120,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 72,
        overflow: "hidden",
      }}
    >
      {/* YES pin */}
      <div
        className={`pin-yes${checked ? " active" : ""}`}
        onClick={() => onChange(!checked)}
        style={{ position: "relative", bottom: 0, width: 56, flexShrink: 0 }}
        title="Click to confirm YES"
      >
        <PinYes active={checked} />
        <span style={{
          display: "block", textAlign: "center",
          fontSize: 12, fontWeight: 800,
          color: checked ? DANGER : "#6b7280",
          marginTop: 4,
          transition: "color 0.3s",
          letterSpacing: "0.5px",
        }}>
          YES
        </span>
      </div>

      {/* Divider dot */}
      <div style={{
        position: "absolute", bottom: 30, left: "50%",
        transform: "translateX(-50%)",
        width: 6, height: 6, borderRadius: "50%",
        background: "#e5e7eb",
      }} />

      {/* NO pin */}
      <div
        className={`pin-no${!checked ? "" : " pushed"}`}
        onClick={() => onChange(false)}
        style={{ position: "relative", bottom: 0, width: 56, flexShrink: 0 }}
        title="Click to select NO"
      >
        <PinNo />
        <span style={{
          display: "block", textAlign: "center",
          fontSize: 12, fontWeight: 800,
          color: !checked ? PRIMARY_DARK : "#d1d5db",
          marginTop: 4,
          transition: "color 0.3s",
          letterSpacing: "0.5px",
        }}>
          NO
        </span>
      </div>
    </div>
  );
}

/* ─── YES pin SVG (blue pushpin pointing up when active) ─── */
function PinYes({ active }: { active: boolean }) {
  return (
    <svg
      width="56" height="90" viewBox="0 0 43 90" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* pin shaft */}
      <rect x="18" y="4" width="7" height="82" rx="3.5"
        fill={active ? DANGER : "#00A3FF"}
        style={{ transition: "fill 0.3s" }}
      />
      {/* shaft outline */}
      <rect x="17.5" y="3.5" width="8" height="83" rx="4"
        fill="none" stroke={active ? DANGER_DARK : PRIMARY_DARK} strokeWidth="1"
        style={{ transition: "stroke 0.3s" }}
      />
      {/* pin head (ball) */}
      <ellipse cx="21.5" cy="22" rx="18" ry="18"
        fill={active ? DANGER : "#00A3FF"}
        style={{ transition: "fill 0.3s" }}
      />
      <ellipse cx="21.5" cy="22" rx="18" ry="18"
        fill="none" stroke={active ? DANGER_DARK : PRIMARY_DARK} strokeWidth="1.2"
        style={{ transition: "stroke 0.3s" }}
      />
      {/* horizontal band */}
      <rect x="3.5" y="18" width="36" height="5" rx="2"
        fill={active ? "#fca5a5" : "#7dd3fc"}
        style={{ transition: "fill 0.3s" }}
      />
      {/* shine */}
      <ellipse cx="14" cy="13" rx="4" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(-20 14 13)" />
      {/* text on head */}
      <text x="21.5" y="28" textAnchor="middle" fontSize="10" fontWeight="800"
        fill="#fff" fontFamily="system-ui,sans-serif"
        style={{ transition: "opacity 0.3s" }}
      >
        YES
      </text>
    </svg>
  );
}

/* ─── NO pin SVG (pink/orange when upright) ─── */
function PinNo() {
  return (
    <svg
      width="56" height="90" viewBox="0 0 42 89" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", margin: "0 auto" }}
    >
      {/* shaft */}
      <rect x="17.5" y="4" width="7" height="81" rx="3.5" fill="#34d399" />
      <rect x="17" y="3.5" width="8" height="82" rx="4" fill="none" stroke="#059669" strokeWidth="1" />
      {/* head */}
      <ellipse cx="21" cy="22" rx="17.5" ry="17.5" fill="#34d399" />
      <ellipse cx="21" cy="22" rx="17.5" ry="17.5" fill="none" stroke="#059669" strokeWidth="1.2" />
      {/* shine */}
      <ellipse cx="13" cy="13" rx="4" ry="3" fill="rgba(255,255,255,0.35)" transform="rotate(-20 13 13)" />
      {/* text */}
      <text x="21" y="28" textAnchor="middle" fontSize="10" fontWeight="800"
        fill="#fff" fontFamily="system-ui,sans-serif">NO</text>
    </svg>
  );
}

/* ══════════════════════ STEP 3 ══════════════════════ */
function Step3() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "48px 32px",
        background: "#fff",
        borderRadius: 22,
        border: `1.5px solid #f3f4f6`,
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        animation: "fadeUp 0.45s ease both",
      }}
    >
      {/* Animated check-ish icon */}
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: DANGER_LIGHT, border: `2px solid ${DANGER}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
        animation: "floatBob 3s ease-in-out infinite",
        fontSize: 32,
      }}>
        👋
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>
        Account Deleted
      </h2>
      <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 20px", lineHeight: 1.6 }}>
        Your account has been permanently removed.<br />
        We're sorry to see you go.
      </p>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 18px", borderRadius: 10,
        background: "#f9fafb", border: "1px solid #e5e7eb",
      }}>
        <span style={{ width: 14, height: 14, border: "2px solid #d1d5db", borderTopColor: PRIMARY, borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
        <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>Redirecting you out…</span>
      </div>
    </div>
  );
}