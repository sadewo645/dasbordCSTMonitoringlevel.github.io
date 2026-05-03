import { motion } from "framer-motion";

const accentClass = {
  cyan: "text-cyan-300",
  yellow: "text-yellow-300",
  blue: "text-blue-300",
  amber: "text-amber-300",
  emerald: "text-emerald-300",
  violet: "text-violet-300",
  fuchsia: "text-fuchsia-300"
};

export default function DataCard({ label, value, unit, accent = "cyan" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass rounded-xl p-4 shadow-card"
    >
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accentClass[accent] || accentClass.cyan}`}>
        {value ?? "--"} <span className="text-base text-slate-300">{unit}</span>
      </p>
    </motion.div>
  );
}
