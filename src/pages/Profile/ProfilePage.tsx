import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";
import donationsApi from "../../api/donationsApi";

const PRIMARY = "#00A3FF";
const PRIMARY_DARK = "#0077B6";
const DANGER = "#ef4444";
const DANGER_DARK = "#b91c1c";

const GLOBAL_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes avatarPulse {
    0%, 100% { transform: scale(1); }
    50%       { transform: scale(1.07); }
  }
  @keyframes heartFloat {
    0%   { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-28px) scale(0.6); }
  }
  @keyframes rippleOut {
    0%   { transform: scale(0); opacity: 0.45; }
    100% { transform: scale(30); opacity: 0; }
  }
`;

export default function ProfilePage() {
  const { user, loading, error } = useProfile();

  /* ── live donation stats from backend ── */
  const [totalDonated, setTotalDonated]   = useState<number>(0);
  const [donationCount, setDonationCount] = useState<number>(0);
  const [causeCount, setCauseCount]       = useState<number>(0);
  const [statsLoading, setStatsLoading]   = useState(true);

  useEffect(() => {
    if (document.getElementById("profile-global-styles")) return;
    const tag = document.createElement("style");
    tag.id = "profile-global-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => tag.remove();
  }, []);

  useEffect(() => {
    donationsApi
      .getMyDonations()
      .then((r) => {
        const donations = r.results ?? [];
        const total     = donations.reduce((s, d) => s + parseFloat(d.amount || "0"), 0);
        const causes    = new Set(donations.map((d) => d.project?.id)).size;
        setTotalDonated(Math.round(total));
        setDonationCount(donations.length);
        setCauseCount(causes);
      })
      .catch(() => {
        /* silently fail — stats just stay 0 */
      })
      .finally(() => setStatsLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error)   return <ErrorState message={error} />;
  if (!user)   return null;

  const initials =
    `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase();

  /* profile picture URL — prepend base URL if it's a relative path */
  const avatarUrl = user.profile_picture
    ? user.profile_picture.startsWith("http")
      ? user.profile_picture
      : `${import.meta.env.VITE_API_BASE_URL}${user.profile_picture}`
    : null;

  const stats = [
    { value: statsLoading ? "…" : `${donationCount}`,        label: "donations"   },
    { value: statsLoading ? "…" : `EGP ${totalDonated.toLocaleString()}`, label: "total given" },
    { value: statsLoading ? "…" : `${causeCount}`,           label: "causes"      },
  ];

  return (
    <div className="min-h-screen flex justify-center px-4 py-10 bg-[#F7FAFC]">
      <div className="w-full max-w-3xl">

        {/* HEADER */}
        <div style={{ animation: "fadeUp 0.3s ease both" }} className="mb-8">
          <p className="text-sm text-gray-400 mb-1">Welcome back</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Your <span style={{ color: PRIMARY }}>Account</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your profile and donation activity
          </p>
        </div>

        {/* PROFILE CARD */}
        <div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
          style={{ animation: "fadeUp 0.38s ease both" }}
        >
          <div className="flex items-center gap-5 mb-5">

            {/* avatar — photo if available, else initials */}
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${user.first_name} ${user.last_name}`}
                className="w-16 h-16 rounded-xl flex-shrink-0 object-cover"
                style={{ animation: "avatarPulse 3.5s ease-in-out infinite" }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, #4FD1FF)`,
                  animation: "avatarPulse 3.5s ease-in-out infinite",
                }}
              >
                {initials || "?"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "#e6f3ff", color: "#185fa5" }}
                >
                  Donor
                </span>
              </div>
              <p className="text-sm text-gray-500">{user.email}</p>
              {user.phone && (
                <p className="text-sm text-gray-400">{user.phone}</p>
              )}
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <StatCard key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col gap-3">
          <RippleButton to="/profile/edit"            label="Edit Profile"    delay={0.08} />
          <RippleButton to="/profile/change-password" label="Change Password" delay={0.16} />
          <RippleButton to="/profile/my-donations"    label="My Donations"    delay={0.24} showHeart />
          <RippleButton to="/profile/delete-account"  label="Delete Account"  delay={0.32} danger />
        </div>

      </div>
    </div>
  );
}

/* ===================== STAT CARD ===================== */

let statStyleInjected = false;

function StatCard({ value, label }: { value: string; label: string }) {
  useEffect(() => {
    if (statStyleInjected) return;
    statStyleInjected = true;
    const tag = document.createElement("style");
    tag.id = "stat-card-styles";
    tag.textContent = `
      .stat-card {
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 8px;
        border-radius: 12px;
        background: #0077B6;
        cursor: default;
        transition: color 0.7s;
      }
      .stat-card .stat-value {
        font-size: 18px;
        font-weight: 700;
        color: #ffffff;
        position: relative;
        z-index: 10;
        transition: text-shadow 0.7s;
        text-shadow: 3px 5px 2px rgba(0,30,60,0.5);
      }
      .stat-card .stat-label {
        font-size: 11px;
        color: rgba(255,255,255,0.8);
        margin-top: 2px;
        position: relative;
        z-index: 10;
        transition: text-shadow 0.7s;
      }
      .stat-card::after {
        content: '';
        position: absolute;
        z-index: 0;
        height: 8px;
        width: 8px;
        background: #003f6b;
        left: 12px;
        bottom: 0;
        translate: 0 100%;
        border-radius: 4px;
        transition: scale 0.7s, translate 0.7s;
      }
      .stat-card:hover::after {
        scale: 300;
      }
      .stat-card:hover .stat-value {
        text-shadow: 2px 2px 2px rgba(160,210,255,0.6);
      }
    `;
    document.head.appendChild(tag);
  }, []);

  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ===================== RIPPLE BUTTON ===================== */

interface RippleButtonProps {
  to: string;
  label: string;
  delay?: number;
  danger?: boolean;
  showHeart?: boolean;
}

function RippleButton({
  to,
  label,
  delay = 0,
  danger = false,
  showHeart = false,
}: RippleButtonProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const accentColor = danger ? DANGER      : PRIMARY;
  const rippleColor = danger ? "rgba(239,68,68,.22)"  : "rgba(0,163,255,.18)";
  const hoverBg     = danger ? "#fff5f5"   : "#f0f9ff";
  const hoverText   = danger ? DANGER_DARK : PRIMARY_DARK;
  const hoverBorder = danger ? "#fca5a5"   : "#7dd3fc";

  function spawnRipple(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = linkRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dot  = document.createElement("span");
    Object.assign(dot.style, {
      position: "absolute", borderRadius: "50%", pointerEvents: "none",
      width: "10px", height: "10px",
      left: `${e.clientX - rect.left - 5}px`,
      top:  `${e.clientY - rect.top  - 5}px`,
      background: rippleColor,
      animation: "rippleOut 0.6s ease-out forwards",
      zIndex: "0",
    });
    el.appendChild(dot);
    setTimeout(() => dot.remove(), 650);
  }

  function spawnHeart() {
    const el = linkRef.current;
    if (!el) return;
    const heart = document.createElement("span");
    Object.assign(heart.style, {
      position: "absolute",
      left: `${20 + Math.random() * 40}px`,
      bottom: "8px", fontSize: "14px",
      pointerEvents: "none",
      animation: "heartFloat 0.7s ease-out forwards",
      zIndex: "10", color: PRIMARY,
    });
    heart.textContent = "♥";
    el.appendChild(heart);
    setTimeout(() => heart.remove(), 750);
  }

  return (
    <Link
      ref={linkRef}
      to={to}
      onMouseEnter={() => { setHovered(true); if (showHeart) spawnHeart(); }}
      onMouseLeave={() => setHovered(false)}
      onClick={spawnRipple}
      style={{
        display: "block", position: "relative", overflow: "hidden",
        padding: "16px 24px", borderRadius: "12px",
        border: `1px solid ${hovered ? hoverBorder : "#e5e7eb"}`,
        background: hovered ? hoverBg : "#ffffff",
        color: hovered ? hoverText : "#111827",
        fontWeight: 600, fontSize: "16px", textDecoration: "none",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform 0.22s ease, background 0.22s ease, border-color 0.22s ease, color 0.22s ease, box-shadow 0.22s ease",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
        animation: `fadeUp 0.4s ease ${delay}s both`,
      }}
    >
      <span style={{
        position: "absolute", left: 0, top: "12px", bottom: "12px",
        width: "3px", borderRadius: "0 2px 2px 0", background: accentColor,
        transformOrigin: "center",
        transform: hovered ? "scaleY(1)" : "scaleY(0)",
        transition: "transform 0.22s ease",
      }} />
      <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
      <span style={{
        position: "absolute", right: "20px", top: "50%",
        transform: hovered ? "translateY(-50%) translateX(3px)" : "translateY(-50%) translateX(0)",
        transition: "transform 0.22s ease",
        color: hovered ? accentColor : "#9ca3af",
        fontSize: "20px", lineHeight: 1,
      }}>›</span>
    </Link>
  );
}

/* ===================== LOADER ===================== */

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
      <div
        className="w-10 h-10 rounded-full"
        style={{ border: "2px solid #e5e7eb", borderTopColor: PRIMARY, animation: "spin 0.8s linear infinite" }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ===================== ERROR ===================== */

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
      <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl text-sm">
        {message}
      </div>
    </div>
  );
}