import { motion } from "framer-motion";

export default function Tank({ cpo = 0, water = 0, sludge = 0 }) {
  const total = cpo + water + sludge || 1;
  const cpoH = (cpo / total) * 100;
  const waterH = (water / total) * 100;
  const sludgeH = (sludge / total) * 100;

  return (
    <div className="glass w-full max-w-[220px] rounded-[42px] border-2 border-sky-300/40 bg-slate-900/30 p-3 shadow-glow">
      <div className="relative h-[420px] overflow-hidden rounded-[30px] border border-slate-500/40 bg-slate-950/80">
        <motion.div
          animate={{ height: `${sludgeH}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute bottom-0 w-full bg-gradient-to-t from-amber-950 to-amber-700/90"
        />
        <motion.div
          animate={{ height: `${waterH}%`, bottom: `${sludgeH}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute w-full bg-gradient-to-t from-blue-900 to-cyan-400/80"
        />
        <motion.div
          animate={{ height: `${cpoH}%`, bottom: `${sludgeH + waterH}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute w-full bg-gradient-to-t from-yellow-700 to-yellow-300/90"
        />
      </div>
    </div>
  );
}
