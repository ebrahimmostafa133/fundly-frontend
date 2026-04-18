import { PRIMARY } from "../utils/constants";

export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FAFC]">
      <div
        className="w-10 h-10 rounded-full"
        style={{
          border: "2px solid #e5e7eb",
          borderTopColor: PRIMARY,
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
