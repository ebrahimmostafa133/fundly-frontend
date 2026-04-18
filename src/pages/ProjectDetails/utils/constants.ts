/** Design tokens shared across all ProjectDetails components */
export const PRIMARY = "#0ea5e9";
export const PRIMARY_DARK = "#0284c7";

/** Global keyframe animations injected once into <head> */
export const GLOBAL_STYLES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  .animate-fadeUp  { animation: fadeUp 0.4s ease both; }
  .animate-slideIn { animation: slideIn 0.35s ease both; }
  .animate-popIn   { animation: popIn 0.3s ease both; }
`;
