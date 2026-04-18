import {
  useState,
  useEffect,
  useRef,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProfile } from "../../hooks/useProfile";

const P    = "#00A3FF";
const BASE = (import.meta.env.VITE_API_BASE_URL as string) ?? "";

function resolveUrl(path?: string | null): string | null {
  if (!path) return null;
  return path.startsWith("http") ? path : `${BASE}${path}`;
}

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;800&display=swap');

.page {
  min-height:100vh;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  background:#f4f8fb;
  font-family:'Space Grotesk', sans-serif;
  padding:40px 20px;
}
.user-box {
  display:flex;
  align-items:center;
  gap:16px;
  margin-bottom:30px;
}
.user-avatar {
  width:64px;
  height:64px;
  border:3px solid #000;
  box-shadow:4px 4px 0 #000;
  object-fit:cover;
  background:#000;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  font-size:20px;
}
.user-name {
  font-weight:800;
  font-size:18px;
}
.container {
  perspective:1200px;
  width:460px;
}
.card {
  position:relative;
  width:100%;
  height:120px;
  background:linear-gradient(135deg,#00A3FF,#4FD1FF);
  border:4px solid #000;
  box-shadow:10px 10px 0 #000,20px 20px 0 rgba(0,163,255,.25);
  overflow:hidden;
  transition:.5s;
}
.card:hover {
  height:400px;
  transform:translateZ(25px) rotateX(4deg) rotateY(-4deg);
}
.title {
  position:absolute;
  width:100%;
  height:120px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:800;
  letter-spacing:2px;
  font-size:18px;
}
.card:hover .title {
  opacity:0;
  transform:translateY(-20px);
}
.form {
  position:absolute;
  width:100%;
  height:100%;
  padding:30px;
  display:flex;
  flex-direction:column;
  gap:14px;
  opacity:0;
  transform:translateY(30px);
  transition:.5s;
}
.card:hover .form {
  opacity:1;
  transform:translateY(0);
}
.input {
  padding:12px;
  border:3px solid #000;
  font-weight:700;
  box-shadow:4px 4px 0 #000;
}
.input:focus {
  outline:none;
  transform:translate(2px,2px);
  box-shadow:1px 1px 0 #000;
}
.btn {
  padding:14px;
  background:#000;
  color:#fff;
  font-weight:800;
  border:none;
  box-shadow:5px 5px 0 ${P};
  cursor:pointer;
}
.btn:hover {
  transform:translate(3px,3px);
  box-shadow:2px 2px 0 ${P};
}
`;

export default function EditProfilePage() {
  const { user, loading, updating, updateProfile } = useProfile();
  const navigate = useNavigate();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [form, setForm]           = useState({ first_name: "", last_name: "", phone: "" });
  const [preview, setPreview]     = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [success, setSuccess]     = useState(false);

  /* track whether current preview is a local blob the user picked */
  const savedPreviewRef = useRef<string | null>(null);

  /* inject styles once */
  useEffect(() => {
    const tag = document.createElement("style");
    tag.innerHTML = STYLES;
    document.head.appendChild(tag);
  }, []);

  /* populate form + preview from backend on initial load only */
  useEffect(() => {
    if (!user) return;

    setForm({
      first_name: user.first_name ?? "",
      last_name:  user.last_name  ?? "",
      phone:      user.phone      ?? "",
    });

    /* if we just saved (savedPreviewRef has the new URL), use that.
       otherwise fall back to whatever backend returns.              */
    if (savedPreviewRef.current) {
      setPreview(savedPreviewRef.current);
      savedPreviewRef.current = null;
    } else {
      setPreview(resolveUrl(user.profile_picture));
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", form.first_name);
    formData.append("last_name",  form.last_name);
    formData.append("phone",      form.phone);
    if (photoFile) formData.append("profile_picture", photoFile);

    const ok = await updateProfile(formData);

    if (ok) {
      /* stash the current preview so the useEffect doesn't wipe it
         when setUser(updated) triggers a re-render                  */
      savedPreviewRef.current = preview;
      setPhotoFile(null);
      setSuccess(true);
      setTimeout(() => navigate("/profile"), 1500);
    }
  };

  if (loading) return <PageLoader />;

  const displayName =
    [form.first_name, form.last_name].filter(Boolean).join(" ") || "Your Name";

  const initials =
    `${form.first_name?.[0] ?? ""}${form.last_name?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="page">

      <div className="user-box">
        {preview ? (
          <img src={preview} alt={displayName} className="user-avatar" />
        ) : (
          <div className="user-avatar">{initials}</div>
        )}
        <div className="user-name">{displayName}</div>
      </div>

      {success && <SuccessBanner />}

      <div className="container">
        <div className="card">
          <div className="title">Edit Profile</div>
          <form className="form" onSubmit={handleSubmit}>
            <input
              className="input"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="First Name"
            />
            <input
              className="input"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="Last Name"
            />
            <input
              className="input"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            <button
              type="button"
              className="btn"
              onClick={() => fileRef.current?.click()}
              style={{ background: "#111" }}
            >
              {photoFile ? "Photo selected ✓" : "Upload Photo"}
            </button>
            <button className="btn" disabled={updating}>
              {updating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/*"
        onChange={handlePhotoChange}
      />

      <BackLink />
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/profile" style={{ marginTop: 20, fontWeight: 700, color: P }}>
      ← Back
    </Link>
  );
}

function SuccessBanner() {
  return (
    <div style={{
      marginBottom: 20, padding: "10px 16px",
      background: "#d1fae5", border: "2px solid #000", fontWeight: 700,
    }}>
      Profile updated successfully ✅
    </div>
  );
}

function PageLoader() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        width: 40, height: 40,
        border: "4px solid #ddd", borderTopColor: P,
        borderRadius: "50%", animation: "spin 1s linear infinite",
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}