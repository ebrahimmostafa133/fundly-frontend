import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";

const PRIMARY      = "#00A3FF";
const PRIMARY_DARK = "#0090e0";

/* ── global keyframes injected once ── */
const GLOBAL_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes avatarPulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.06); }
  }
  @keyframes rippleOut {
    0%   { transform: scale(0); opacity: 0.4; }
    100% { transform: scale(30); opacity: 0; }
  }
  @keyframes checkPop {
    0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
    70%  { transform: scale(1.2) rotate(2deg); }
    100% { transform: scale(1) rotate(0); opacity: 1; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes barGrow {
    from { width: 0; }
    to   { width: calc(100% - 16px); }
  }
`;

export default function EditProfilePage() {
  const { user, loading, updateProfile, updating } = useProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [success, setSuccess] = useState(false);

  /* inject global styles once */
  useEffect(() => {
    if (document.getElementById("ep-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "ep-global-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  /* populate form when user loads */
  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name:  user.last_name  ?? "",
        phone:      user.phone      ?? "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    const ok = await updateProfile(form);
    if (ok) {
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1800);
    }
  };

  if (loading) return <PageLoader />;

  const initials = `${form.first_name?.[0] ?? ""}${form.last_name?.[0] ?? ""}`.toUpperCase();
  const displayName = [form.first_name, form.last_name].filter(Boolean).join(" ") || "Your Name";

  return (
    <div
      className="min-h-screen px-4 py-10 bg-[#F7FAFC]"
      style={{ animation: "fadeUp 0.3s ease both" }}
    >
      <div className="max-w-xl mx-auto">

        {/* BACK */}
        <BackLink />

        {/* HEADER */}
        <div className="mb-8" style={{ animation: "fadeUp 0.32s ease both" }}>
          <p className="text-sm text-gray-400 mb-1">Account settings</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Edit <span style={{ color: PRIMARY }}>Profile</span>
          </h1>
        </div>

        {/* SUCCESS BANNER */}
        {success && <SuccessBanner />}

        {/* FORM CARD */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-8"
          style={{
            animation: "fadeUp 0.38s ease both",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
          }}
        >
          {/* Avatar row — updates live as user types */}
          <div
            className="flex items-center gap-4 pb-6 mb-6"
            style={{ borderBottom: "1px solid #f3f4f6" }}
          >
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${PRIMARY}, #4FD1FF)`,
                animation: "avatarPulse 3.5s ease-in-out infinite",
              }}
            >
              {initials || "?"}
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">{displayName}</p>
              <p className="text-sm text-gray-400 mt-0.5">Personal information</p>
            </div>
          </div>

          {/* FIELDS */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-5">

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="First name"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder="Jane"
                  delay="0.42s"
                />
                <Field
                  label="Last name"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  delay="0.46s"
                />
              </div>

              <Field
                label="Phone number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+20 xxx xxx xxxx"
                delay="0.50s"
              />
            </div>

            {/* ACTIONS */}
            <div
              className="flex items-center gap-3 mt-8"
              style={{ animation: "fadeUp 0.54s ease both" }}
            >
              <SaveButton loading={updating} />
              <Link
                to="/profile"
                className="flex items-center px-6 py-3.5 rounded-xl text-sm font-semibold text-gray-500 transition-all duration-200"
                style={{
                  border: "1.5px solid #e5e7eb",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = PRIMARY;
                  (e.currentTarget as HTMLAnchorElement).style.color = PRIMARY;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#6b7280";
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

/* ===================== BACK LINK ===================== */

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

/* ===================== FIELD ===================== */

interface FieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  delay?: string;
}

function Field({
  label,
  name,
  value,
  type = "text",
  onChange,
  placeholder,
  delay = "0s",
}: FieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ animation: `fadeUp 0.4s ease ${delay} both` }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: focused ? PRIMARY : "#9ca3af",
          marginBottom: 8,
          transition: "color 0.18s",
        }}
      >
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            padding: "13px 42px 13px 16px",
            borderRadius: 10,
            border: `1.5px solid ${focused ? PRIMARY : "#e5e7eb"}`,
            background: "#fff",
            color: "#111827",
            fontSize: 15,
            fontWeight: 500,
            outline: "none",
            transition: "border-color 0.18s, box-shadow 0.18s",
            boxShadow: focused
              ? "0 0 0 3px rgba(0,163,255,0.1)"
              : "none",
          }}
        />

        {/* animated underbar */}
        <span
          style={{
            position: "absolute",
            bottom: 0,
            left: 8,
            height: 2,
            borderRadius: 1,
            background: PRIMARY,
            transition: "width 0.32s ease",
            width: focused ? "calc(100% - 16px)" : 0,
          }}
        />

        {/* field icon */}
        <span
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 14,
            color: focused ? PRIMARY : "#d1d5db",
            transition: "color 0.18s",
            pointerEvents: "none",
          }}
        >
          ✦
        </span>
      </div>
    </div>
  );
}

/* ===================== SAVE BUTTON ===================== */

function SaveButton({ loading }: { loading: boolean }) {
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

  return (
    <button
      ref={btnRef}
      type="submit"
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={spawnRipple}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "14px 32px",
        borderRadius: 10,
        border: "none",
        background: loading ? PRIMARY : hovered ? PRIMARY_DARK : PRIMARY,
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: "0.5px",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.78 : 1,
        transform: hovered && !loading ? "translateY(-2px)" : "translateY(0)",
        boxShadow:
          hovered && !loading
            ? "0 6px 20px rgba(0,163,255,0.3)"
            : "none",
        transition:
          "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease",
        display: "flex",
        alignItems: "center",
        gap: 8,
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
        {loading ? "Saving…" : "Save changes"}
      </span>
    </button>
  );
}

/* ===================== SUCCESS BANNER ===================== */

function SuccessBanner() {
  return (
    <div
      className="flex items-center gap-3 p-4 mb-6 rounded-xl"
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
          animation: "checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        }}
      >
        ✓
      </span>
      <p className="text-sm font-semibold" style={{ color: "#15803d" }}>
        Profile updated — redirecting you back…
      </p>
    </div>
  );
}

/* ===================== LOADER ===================== */

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
      <div
        style={{
          width: 36,
          height: 36,
          border: "2.5px solid #e5e7eb",
          borderTopColor: PRIMARY,
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}