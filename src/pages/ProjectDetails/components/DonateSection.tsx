import { useState } from "react";
import { Link } from "react-router-dom";
import { TbHeart } from "react-icons/tb";
import donationsApi from "../../../api/donationsApi";

interface Props {
  projectId: number;
  isLoggedIn: boolean;
  onDonated: () => void;
}

const PRESETS = [50, 100, 250, 500];

export default function DonateSection({ projectId, isLoggedIn, onDonated }: Props) {
  const [amount, setAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleDonate() {
    const val = Number(amount);
    if (!val || val <= 0) {
      setMsg({ type: "error", text: "Please enter a valid amount" });
      return;
    }

    setDonating(true);
    setMsg(null);

    try {
      await donationsApi.donateToProject(projectId, val);
      setMsg({ type: "success", text: "Thank you for your generous donation! 🎉" });
      setAmount("");
      onDonated();
    } catch {
      setMsg({ type: "error", text: "Donation failed. Please try again." });
    } finally {
      setDonating(false);
    }
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
        <TbHeart size={16} className="text-error-500" />
        Support this Project
      </h3>

      {/* Guest prompt */}
      {!isLoggedIn ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-2">
            Please log in to make a donation
          </p>
          <Link
            to="/login"
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            Log In
          </Link>
        </div>
      ) : (
        <>
          {/* Preset amounts */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESETS.map((val) => (
              <button
                key={val}
                onClick={() => setAmount(String(val))}
                className={`py-2 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                  amount === String(val)
                    ? "bg-primary-500 text-white border-primary-500 shadow-sm"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary-300 hover:bg-primary-50"
                }`}
              >
                {val} EGP
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="relative mb-3">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              EGP
            </span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Custom amount"
              className="w-full border border-gray-200 rounded-xl pl-14 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleDonate}
            disabled={donating}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <TbHeart size={18} />
            {donating ? "Processing..." : "Donate Now"}
          </button>

          {/* Feedback */}
          {msg && (
            <div
              className={`mt-3 px-4 py-2.5 rounded-xl text-sm animate-popIn ${
                msg.type === "success"
                  ? "bg-success-50 text-success-700 border border-success-200"
                  : "bg-error-50 text-error-700 border border-error-200"
              }`}
            >
              {msg.text}
            </div>
          )}
        </>
      )}
    </div>
  );
}
